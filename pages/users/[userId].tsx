import Header from "@/components/Header";
import PostFeed from "@/components/posts/PostFeed";
import UserBio from "@/components/users/UserBio";
import UserHero from "@/components/users/userHero";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";

const UserView = (props) => {
    const router = useRouter();
    const { userId } = router.query;
const {data: fetchedUser,isLoading} = useUser(userId as string);
if(isLoading || !fetchedUser) {
    return (
        <div className="
        flex
        justfiy-center
        items-center
        h-full">

        <ClipLoader color="Lightblue" size={80} />

        </div>
    )
}

return (
   <>
   <Header showBackArrow  label={fetchedUser?.name} />
   <UserHero userId={userId as string} />
   <UserBio userId={userId as string} />
   <PostFeed userId={userId as string} />
   </>
    );
}

export default UserView;
