// TODO: Create an interface for the Candidate objects returned by the API
export interface Candidate {
    id: number | null;
    name: string | null;
    userName: string | null;
    location: string | null;
    avatarUrl: string | null;
    email: string | null;
    html_url: string | null;
    company: string | null;
}

