"use client";

import { useEditorState } from "@tiptap/react";
import { Youtube } from "lucide-react";
import React, { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToolbar } from "./toolbar-provider";

const YoutubeToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, onClick, children, ...props }, ref) => {
		const { editor } = useToolbar();
		const [isOpen, setIsOpen] = useState(false);
		const [url, setUrl] = useState("");

		const editorState = useEditorState({
			editor,
			selector: (ctx) => ({
				isYoutubeActive: ctx.editor.isActive("youtube") ?? false,
			}),
		});

		const addYoutubeVideo = () => {
			if (url) {
				editor.commands.setYoutubeVideo({
					src: url,
				});
			}
			setIsOpen(false);
			setUrl("");
		};

		return (
			<>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className={cn(
								"h-8 w-8",
								editorState.isYoutubeActive && "bg-accent",
								className,
							)}
							onClick={(e) => {
								setIsOpen(true);
								onClick?.(e);
							}}
							ref={ref}
							{...props}
						>
							{children || <Youtube className="h-4 w-4" />}
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<span>Youtube</span>
					</TooltipContent>
				</Tooltip>

				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Insert Youtube Video</DialogTitle>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="youtube-url" className="text-right">
									URL
								</Label>
								<Input
									id="youtube-url"
									value={url}
									onChange={(e) => setUrl(e.target.value)}
									className="col-span-3"
									placeholder="https://www.youtube.com/watch?v=..."
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											addYoutubeVideo();
										}
									}}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsOpen(false)}
							>
								Cancel
							</Button>
							<Button type="button" onClick={addYoutubeVideo}>
								Insert
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</>
		);
	},
);

YoutubeToolbar.displayName = "YoutubeToolbar";

export { YoutubeToolbar };
