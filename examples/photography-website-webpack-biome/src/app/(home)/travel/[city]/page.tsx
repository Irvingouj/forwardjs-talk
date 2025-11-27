import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CityView } from "@/modules/travel/ui/views/city-view";
import { getQueryClient, trpc } from "@/trpc/server";

type Props = {
	params: Promise<{
		city: string;
	}>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const city = (await params).city;

	return {
		title: decodeURIComponent(city),
	};
}

const Page = async ({ params }: Props) => {
	const { city } = await params;

	// Decode URL-encoded params
	const decodedCity = decodeURIComponent(city);

	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(
		trpc.travel.getOne.queryOptions({
			city: decodedCity,
		}),
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ErrorBoundary fallback={<p>Something went wrong</p>}>
				<Suspense fallback={<p>Loading...</p>}>
					<CityView city={decodedCity} />
				</Suspense>
			</ErrorBoundary>
		</HydrationBoundary>
	);
};

export default Page;
