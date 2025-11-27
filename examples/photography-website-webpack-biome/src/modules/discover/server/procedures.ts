import { and, desc, eq, isNotNull } from "drizzle-orm";
import z from "zod";
import { db } from "@/db";
import { photos } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const discoverRouter = createTRPCRouter({
	getManyPhotos: baseProcedure.input(z.object({})).query(async () => {
		const data = await db
			.select({
				id: photos.id,
				url: photos.url,
				title: photos.title,
				latitude: photos.latitude,
				longitude: photos.longitude,
				blurData: photos.blurData,
				width: photos.width,
				height: photos.height,
				dateTimeOriginal: photos.dateTimeOriginal,
			})
			.from(photos)
			.where(
				and(
					eq(photos.visibility, "public"),
					isNotNull(photos.latitude),
					isNotNull(photos.longitude),
				),
			)
			.orderBy(desc(photos.updatedAt));

		return data;
	}),
});
