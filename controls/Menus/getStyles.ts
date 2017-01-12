import prefixAll from "../../common/prefixAll";

export default function getStyles(): {
	container?: React.CSSProperties,
	itemContainer?: React.CSSProperties,
	item?: React.CSSProperties,
} {
	return {
		container: prefixAll({
			display: "flex",
			flex: "0 0 auto",
			flexDirection: "column",
			alignContent: "flex-center",
			justifyContent: "center",
			userSelect: "none",
			cursor: "pointer",
			padding: "5px 20px",
			transition: "all .25s 0s ease-in-out",
			position: "relative",
		}),
		itemContainer: prefixAll({
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			position: "absolute",
			maxHeight: 0,
			transition: "all .25s 0s ease-in-out",
		}),
		item: prefixAll({
			position: "absolute",
			transition: "all .25s 0s ease-in-out",
		})
	};
}
