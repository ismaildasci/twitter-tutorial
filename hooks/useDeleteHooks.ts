import { useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import useCurrentUser from './useCurrentUser';
import usePosts from './usePosts';
import usePost from './usePost';

interface Post {
  id: string;
  // Diğer post özellikleri eklenebilir
}

const useDeleteHooks = ({ postId, userId }: { postId: string, userId?: string }) => {
  const { data: currentUser } = useCurrentUser();
  const { data: fetchedPost, mutate: mutateFetchedPost } = usePost(postId);
  const { mutate: mutateFetchedPosts } = usePosts(userId);

  const deletePost = useCallback(async () => {
    if (!currentUser) {
      toast.error('You need to be logged in to delete a post');
      return;
    }

    const confirmation = window.confirm('Bu gönderiyi silmek istediğinize emin misiniz?');
    if (!confirmation) {
      return;
    }

    try {
      await axios.delete(`/api/posts/${postId}`);

      // Gönderi listesini güncelle
      mutateFetchedPosts();
      mutateFetchedPost();

      toast.success('Gönderi başarıyla silindi');
    } catch (error) {
      toast.error('Gönderi silinirken bir hata oluştu');
    }
  }, [currentUser, mutateFetchedPosts]);

  return deletePost;
};

export default useDeleteHooks;
