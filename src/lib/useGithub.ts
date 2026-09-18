import { useQuery } from "@tanstack/react-query";
import { repos as bakedRepos, type Repo } from "@/data/repos";
import { getRepos, getBlogPosts, type BlogPost } from "./github.functions";

export function useLiveRepos(): { repos: Repo[]; isSyncing: boolean } {
  const query = useQuery({
    queryKey: ["github", "repos"],
    queryFn: () => getRepos(),
    initialData: bakedRepos,
    staleTime: 5 * 60 * 1000,
  });
  return { repos: query.data ?? bakedRepos, isSyncing: query.isFetching };
}

export function useBlogPosts(): { posts: BlogPost[]; isLoading: boolean } {
  const query = useQuery({
    queryKey: ["github", "blog"],
    queryFn: () => getBlogPosts(),
    staleTime: 5 * 60 * 1000,
  });
  return { posts: query.data ?? [], isLoading: query.isLoading };
}
