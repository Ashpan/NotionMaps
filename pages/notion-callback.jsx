import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

const NotionCallback = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();

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

      const code = router.query.code;
      if (code) {
        axiosInstance
          .request({
            method: "GET",
            url: `/api/user-exists`,
          })
          .then((response) => {
            console.log(response);
            if (response.data.exists === false) {
              const databaseId = prompt("Enter your database ID");
              if (databaseId === null) {
                alert("Please enter a database ID");
                location.reload();
              }
              axiosInstance
                .request({
                  method: "POST",
                  url: `/api/token`,
                  data: {
                    code: code,
                    databaseId: databaseId,
                  },
                })
                .then((response) => {
                  console.log(response);
                  if (response.status === 200 || response.status === 204) {
                    window.location.assign("/map");
                  } else {
                    // redirect to auth url
                  }
                })
                .catch((error) => {
                  console.error("Error fetching filter options:", error);
                });
            } else {
              window.location.assign("/map");
            }
          });
      }
    }
  }, [router.query.code, isLoading, user]);
  return (
    <div>
      <p> Handling Notion Callback ... </p>
    </div>
  );
};

export default NotionCallback;
