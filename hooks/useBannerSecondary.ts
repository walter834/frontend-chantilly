import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  BannerSecondary, 
  getBannerSecondary, 
  updateBannerSecondary 
} from '@/service/bannerFooter/bannerFooterService';

export const BANNER_QUERY_KEY = 'bannerSecondary';

export function useBannerSecondary() {
  return useQuery<BannerSecondary[]>({
    queryKey: [BANNER_QUERY_KEY],
    queryFn: getBannerSecondary,
  });
}

export function useUpdateBannerSecondary() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => 
      updateBannerSecondary(id, formData),
    onSuccess: () => {
      // Invalidate and refetch the banners query to update the UI
      queryClient.invalidateQueries({ queryKey: [BANNER_QUERY_KEY] });
    },
  });
}
