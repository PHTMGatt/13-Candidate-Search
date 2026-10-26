export interface Candidate {
  id: number | null;
  name: string | null;
  login: string | null;
  location: string | null;
  avatar_url: string | null;
  email: string | null;
  html_url: string | null;
  company: string | null;
  bio: string | null;
  public_repos?: number;
  public_gists?: number;
  followers?: number;
  following?: number;
  created_at?: string;
  updated_at?: string;
  type?: string;
  skills?: string[];
  matched_repositories?: number;
  match_score?: number;
}

export type CandidateSearchResult = {
  candidates: Candidate[];
  totalCount: number;
};
