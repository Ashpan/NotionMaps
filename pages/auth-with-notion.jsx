import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

const AuthWithNotion = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();

  const handleAuthWithNotion = () => {
    window.location.href = process.env.NEXT_PUBLIC_NOTION_AUTHORIZATION_URL;
  };
  useEffect(() => {
    if (!isLoading) {
      const userId = user.name;
      const axiosInstance = axios.create({
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      axiosInstance
        .request({
          method: "GET",
          url: `/api/user-exists`,
        })
        .then((response) => {
          console.log(response);
          if (response.data.exists === true) {
            window.location.assign("/map");
          }
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, [user, isLoading]);

  return (
    <div>
      <h1> Authorize with Notion </h1>
      <button onClick={handleAuthWithNotion}> Authorize </button>
    </div>
  );
};

export default withPageAuthRequired(AuthWithNotion);
