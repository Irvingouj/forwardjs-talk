import Link from "next/link";
import { RiCameraLensFill } from "react-icons/ri";
import WordRotate from "../word-rotate";

const Logo = () => {
	return (
		<Link href="/" className="flex gap-2 items-center">
			<RiCameraLensFill size={18} />
			<WordRotate label="ECarry" label2="Photo" style="font-medium uppercase" />
		</Link>
	);
};

export default Logo;
