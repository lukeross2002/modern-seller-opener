export const runtime = "nodejs";
export const maxDuration = 30;

type CompanyDetails = {
  name?: string;
  description?: string;
  industries?: string[];
  employee_count?: number;
  founded_year?: number;
  company_type?: string;
  website?: string;
  executives?: Array<{ name?: string; title?: string }>;
  addresses?: Array<{ city?: string; country?: string; is_primary?: boolean }>;
};

type EmployeeProfile = {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  current_position?: { title?: string; company_name?: string; description?: string; start_date?: string };
  positions?: Array<{ title?: string; company_name?: string; start_date?: string; end_date?: string }>;
  summary?: string;
  headline?: string;
  location?: { city?: string; country?: string };
  linkedin_url?: string;
};

function normalizeWebsite(input: string): string | null {
  try {
    const trimmed = (input || "").trim();
    if (!trimmed) return null;
    const withProtocol = trimmed.match(/^https?:\/\//) ? trimmed : `https://${trimmed}`;
    const u = new URL(withProtocol);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

async function np(path: string, params: Record<string, string>, key: string, timeoutMs = 18000) {
  const qs = new URLSearchParams(params).toString();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`https://nubela.co/api/v1/${path}?${qs}`, {
      headers: { Authorization: `Bearer ${key}` },
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    const txt = await res.text();
    if (!res.ok) {
      throw new Error(`NP ${path} ${res.status}: ${txt.slice(0, 200)}`);
    }
    return JSON.parse(txt);
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

export async function POST(req: Request) {
  try {
    const { companyWebsite, prospectFirstName, prospectRole } = await req.json();

    const website = normalizeWebsite(companyWebsite);
    if (!website) {
      return Response.json(
        { error: "Need a valid company website (e.g. acme.com)." },
        { status: 400 }
      );
    }

    const key = process.env.PROXYCURL_API_KEY;
    if (!key) {
      return Response.json({ error: "Server is missing PROXYCURL_API_KEY." }, { status: 500 });
    }

    // 1. Company details (1 credit, ~2s)
    let company: CompanyDetails | null = null;
    let companyError: string | null = null;
    try {
      company = await np("company/details", { website }, key);
    } catch (e) {
      companyError = e instanceof Error ? e.message : String(e);
    }

    // 2. Employee profile (1 credit, only if we have a first name)
    let employee: EmployeeProfile | null = null;
    let employeeError: string | null = null;
    if (prospectFirstName?.trim()) {
      try {
        const params: Record<string, string> = { employer_website: website, first_name: prospectFirstName.trim() };
        if (prospectRole?.trim()) params.role = prospectRole.trim();
        employee = await np("employee/profile", params, key);
      } catch (e) {
        employeeError = e instanceof Error ? e.message : String(e);
      }
    }

    // If both research sources failed, return 200 with status so the tool falls through to
    // generation using only the user-supplied inputs. This keeps the experience working
    // even when NinjaPear is rate-limited or out of credits.
    if (!company && !employee) {
      const reason = (companyError || employeeError || "").includes("Insufficient credits")
        ? "no_credits"
        : "not_found";
      return Response.json({
        research: null,
        status: reason,
        website,
      });
    }

    // Compose a clean research summary for the LLM
    const research = {
      company: company
        ? {
            name: company.name,
            website: company.website || website,
            description: company.description?.slice(0, 600),
            industries: company.industries?.slice(0, 3),
            employeeCount: company.employee_count,
            foundedYear: company.founded_year,
            type: company.company_type,
            hq: company.addresses?.find((a) => a.is_primary)?.city,
            keyExecutives: (company.executives || []).slice(0, 6).map((e) => ({
              name: e.name,
              title: e.title,
            })),
          }
        : null,
      employee: employee
        ? {
            name: employee.full_name || `${employee.first_name || ""} ${employee.last_name || ""}`.trim(),
            firstName: employee.first_name,
            headline: employee.headline,
            currentRole: employee.current_position?.title,
            currentRoleStarted: employee.current_position?.start_date,
            currentCompany: employee.current_position?.company_name,
            location: [employee.location?.city, employee.location?.country].filter(Boolean).join(", "),
            summary: employee.summary?.slice(0, 600),
            linkedinUrl: employee.linkedin_url,
            tenureRoles: (employee.positions || []).slice(0, 4).map((p) => ({
              title: p.title,
              company: p.company_name,
              start: p.start_date,
              end: p.end_date,
            })),
          }
        : null,
      _diagnostics: {
        companyError,
        employeeError,
      },
    };

    return Response.json({ research });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
