import { redirect } from "next/navigation";

export const redirectToUnauthorized = () => {
  redirect("/unauthorized");
};

export const redirectToUnauthenticated = () => {
  redirect("/unauthenticated");
}; 