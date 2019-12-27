import * as React from "react";

interface Props
	extends React.DetailedHTMLProps<
		React.ImgHTMLAttributes<HTMLImageElement>,
		HTMLImageElement
	> {
	path: string;
}

export default function BungieApiImage({ path, ...props }: Props) {
	return <img src={`https://www.bungie.net${path}`} {...props} />;
}
