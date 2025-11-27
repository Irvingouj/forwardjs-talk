export const dynamic = "force-dynamic";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
	BlogView,
	BlogViewLoadingStatus,
} from "@/modules/blog/ui/views/blog-view";
import { getQueryClient, trpc } from "@/trpc/server";

export const metadata = {
	title: "Blog",
	description: "Blog",
};

const page = () => {
	const queryClient = getQueryClient();
	if (!process.env.CI) {
		void queryClient.prefetchQuery(trpc.blog.getMany.queryOptions());
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<BlogViewLoadingStatus />}>
				<ErrorBoundary fallback={<p>Error</p>}>
					<BlogView />
				</ErrorBoundary>
			</Suspense>
		</HydrationBoundary>
	);
};

export default page;
