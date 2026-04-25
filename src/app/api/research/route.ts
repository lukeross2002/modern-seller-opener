export const runtime = "nodejs";
export const maxDuration = 30;

type Posts = { activities?: Array<{ title?: string; link?: string; activity_status?: string }> };
type Profile = {
  full_name?: string;
  first_name?: string;
  last_name?: string;
  occupation?: string;
  headline?: string;
  summary?: string;
  city?: string;
  country_full_name?: string;
  experiences?: Array<{ title?: string; company?: string; starts_at?: { month?: number; year?: number } | null; description?: string }>;
  public_identifier?: string;
};
type Company = {
  name?: string;
  description?: string;
  industry?: string;
  company_size?: number[];
  hq?: { city?: string; country?: string } | null;
  updates?: Array<{ text?: string; posted_on?: { day?: number; month?: number; year?: number } | null }>;
  funding_data?: Array<{ funding_type?: string; money_raised?: number; announced_date?: { year?: number; month?: number } | null }>;
};

function normalizeLinkedInUrl(input: string): string | null {
  try {
    const trimmed = (input || "").trim();
    if (!trimmed) return null;
    const withProtocol = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    const u = new URL(withProtocol);
    if (!u.hostname.includes("linkedin.com")) return null;
    if (!u.pathname.includes("/in/")) return null;
    u.search = "";
    u.hash = "";
    return u.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

async function px(path: string, key: string, init?: RequestInit) {
  const res = await fetch(`https://nubela.co/proxycurl/api${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Proxycurl ${path} ${res.status}: ${txt.slice(0, 200)}`);
  }
  return res.json();
}

function recentExperience(profile: Profile) {
  const exps = profile.experiences || [];
  if (!exps.length) return null;
  const current = exps[0];
  return {
    title: current.title,
    company: current.company,
    started: current.starts_at?.year || null,
  };
}

export async function POST(req: Request) {
  try {
    const { linkedinUrl } = await req.json();
    const url = normalizeLinkedInUrl(linkedinUrl);
    if (!url) {
      return Response.json(
        { error: "Need a valid LinkedIn profile URL (linkedin.com/in/<handle>)." },
        { status: 400 }
      );
    }

    const key = process.env.PROXYCURL_API_KEY;
    if (!key) {
      return Response.json(
        { error: "Server is missing PROXYCURL_API_KEY." },
        { status: 500 }
      );
    }

    // 1. Fetch profile
    let profile: Profile;
    try {
      profile = await px(
        `/v2/linkedin?url=${encodeURIComponent(url)}&extra=include&fallback_to_cache=on-error&use_cache=if-present`,
        key
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return Response.json(
        { error: `Couldn't pull that LinkedIn profile. It may be private or the URL is wrong. (${msg.slice(0, 120)})` },
        { status: 404 }
      );
    }

    // 2. Fetch recent posts (best-effort)
    let posts: Posts["activities"] = [];
    try {
      const postsRes: Posts = await px(
        `/v2/linkedin/profile/posts?linkedin_profile_url=${encodeURIComponent(url)}`,
        key
      );
      posts = (postsRes.activities || []).slice(0, 5);
    } catch {
      // not fatal
    }

    // 3. Fetch current company info (best-effort) using the most recent experience
    let company: Company | null = null;
    let companyName: string | undefined;
    const currentExp = (profile.experiences || [])[0];
    companyName = currentExp?.company;
    try {
      if (companyName) {
        const search = await px(
          `/linkedin/company/resolve?company_name=${encodeURIComponent(companyName)}&enrich_profile=enrich`,
          key
        );
        if (search?.url) {
          const companyRes: Company = await px(
            `/linkedin/company?url=${encodeURIComponent(search.url)}&use_cache=if-present`,
            key
          );
          company = companyRes;
        }
      }
    } catch {
      // not fatal
    }

    // 4. Compose a clean research summary for the LLM
    const recent = recentExperience(profile);
    const fundingHits = (company?.funding_data || []).slice(0, 2).map((f) => ({
      type: f.funding_type,
      raised: f.money_raised,
      year: f.announced_date?.year,
    }));
    const companyUpdates = (company?.updates || []).slice(0, 3).map((u) => u.text).filter(Boolean);

    const research = {
      profile: {
        name: profile.full_name || `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
        firstName: profile.first_name,
        headline: profile.headline,
        currentRole: recent?.title,
        currentCompany: recent?.company,
        location: [profile.city, profile.country_full_name].filter(Boolean).join(", "),
        publicHandle: profile.public_identifier,
        summary: profile.summary?.slice(0, 600),
      },
      posts: posts?.map((p) => ({
        text: p.title?.slice(0, 400),
        link: p.link,
        type: p.activity_status,
      })) || [],
      company: company
        ? {
            name: company.name,
            industry: company.industry,
            description: company.description?.slice(0, 400),
            sizeRange: company.company_size,
            funding: fundingHits,
            recentUpdates: companyUpdates,
          }
        : null,
    };

    return Response.json({ research });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
