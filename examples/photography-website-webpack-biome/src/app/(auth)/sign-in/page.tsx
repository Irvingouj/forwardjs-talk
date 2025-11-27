import { redirect } from "next/navigation";
import { getSession } from "@/modules/auth/lib/get-session";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";

const page = async () => {
	const session = await getSession();

	if (session) {
		redirect("/");
	}

	return <SignInView />;
};

export default page;
