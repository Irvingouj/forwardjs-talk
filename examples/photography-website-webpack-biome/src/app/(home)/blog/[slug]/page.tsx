import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BlogSlugView } from "@/modules/blog/ui/views/blog-slug-view";
export const dynamic = "force-dynamic";
import { getQueryClient, trpc } from "@/trpc/server";

type Props = {
	params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const slug = (await params).slug;
	// Decode URL-encoded params
	const decodedSlug = decodeURIComponent(slug);
	const queryClient = getQueryClient();
	const data = await queryClient.fetchQuery(
		trpc.blog.getOne.queryOptions({ slug: decodedSlug }),
	);

	return {
		title: data.title,
		description: data.description,
	};
}

export default async function page({ params }: Props) {
	const slug = (await params).slug;
	// Decode URL-encoded params
	const decodedSlug = decodeURIComponent(slug);
	const queryClient = getQueryClient();
	await queryClient.fetchQuery(
		trpc.blog.getOne.queryOptions({ slug: decodedSlug }),
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<p>Loading...</p>}>
				<ErrorBoundary fallback={<p>Error</p>}>
					<BlogSlugView slug={decodedSlug} />
				</ErrorBoundary>
			</Suspense>
		</HydrationBoundary>
	);
}
