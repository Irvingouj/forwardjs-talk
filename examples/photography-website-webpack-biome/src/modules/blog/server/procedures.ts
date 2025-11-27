import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const blogRouter = createTRPCRouter({
	getMany: baseProcedure.query(async () => {
		const data = await db
			.select()
			.from(posts)
			.where(eq(posts.visibility, "public"))
			.orderBy(desc(posts.updatedAt))
			.limit(10);

		return data;
	}),
	getOne: baseProcedure
		.input(
			z.object({
				slug: z.string(),
			}),
		)
		.query(async ({ input }) => {
			const [data] = await db
				.select()
				.from(posts)
				.where(and(eq(posts.slug, input.slug), eq(posts.visibility, "public")));

			if (!data) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			return data;
		}),
});
