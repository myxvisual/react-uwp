let isSupportWebP: boolean;

const elem = document.createElement("canvas");
if (elem.getContext && elem.getContext("2d")) {
	isSupportWebP = elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;
} else {
	isSupportWebP = false;
}

export default isSupportWebP;
