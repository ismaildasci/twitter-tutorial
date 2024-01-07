import Form from "@/components/Form";
import Header from "@/components/Header";
import CommentFeed from "@/components/posts/CommentFeed";
import PostItem from "@/components/posts/PostItem";
import usePost from "@/hooks/usePost";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";

const PostView = (props) => {
    const router = useRouter();
    const {postId} = router.query;

    const {data:fetchedPost,isLoading} = usePost(postId as string);
    useEffect(() => {
        let timeoutId: number | undefined;

        if (!isLoading && !fetchedPost) {

          timeoutId = window.setTimeout(() => {
            router.push('/');
          }, 200);
        }

        return () => {

          if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
          }
        };
      }, [isLoading, fetchedPost, router]);

    if (isLoading || !fetchedPost) {
        return (
            <div className="flex justify-center items-center h-full">
            <ClipLoader color="lightblue" size={80} />
            </div>
        )
    }
    return (
   <>
   <Header label="Tweet" showBackArrow />
   <PostItem data={fetchedPost} />
   <Form
   postId={postId as string}
   isComment
   placeholder="Tweet your reply"
   />
   <CommentFeed comments={fetchedPost?.comments} />
   </>
     );
}

export default PostView;
