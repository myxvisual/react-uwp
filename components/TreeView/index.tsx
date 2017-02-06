import * as React from "react";
import styles from "./index.scss";
const $ = (selectors: string) => document.querySelector(selectors);

interface List {
	titleNode?: string | React.ReactElement<any>;
	children?: List[];
}
interface TreeViewState {
	directories?: any;
	focusFolder?: any;
	listItems?: List[];
}
export default class TreeView extends React.Component<any, TreeViewState> {
	static defaultProps = {
		className: "",
		focusFolder: "",
		style: {}
	};

	state: TreeViewState = {
		directories: null,
		focusFolder: null
	};

	refs: {
		[key: string]: any;
	};

	initDirTree = () => {
		for (const item of this.state.focusFolder) {
			this.toggleFolder({ currentTarget: $(`a[data-path="${item}"]`) }, true);
		}
	}

	toggleFolder = (e: any, isInit = false) => {
		const currentTarget = e.currentTarget;
		const path = currentTarget.getAttribute("data-path");
		const ref = `ref-${path}`;
		const indexFolder = this.state.focusFolder.indexOf(path);
		const setLocalStorage = () => window.localStorage.setItem("wikiDirTreeFocusFolder", JSON.stringify(this.state.focusFolder));
		if (this.refs[ref].style.height !== "auto") {
			if (!isInit) {
				this.state.focusFolder.push(path);
				setLocalStorage();
			}
			currentTarget.children[0].innerText = "keyboard_arrow_down";
			currentTarget.children[1].innerText = "folder_open";
			this.refs[ref].style.height = "auto";
			this.refs[ref].style.padding = "0 0";
			currentTarget.setAttribute("data-openFolder", "true");
		} else {
			if (!isInit) {
				this.state.focusFolder.splice(indexFolder, indexFolder + 1);
				setLocalStorage();
			}
			currentTarget.children[0].innerText = "keyboard_arrow_right";
			currentTarget.children[1].innerText = "folder";
			this.refs[ref].style.height = "0";
			this.refs[ref].style.padding = "2px 0";
			currentTarget.setAttribute("data-openFolder", "false");
		}
	}

	renderFolder = (folder: any) => {
		const listItems: List[] = [];
		listItems.map(({ titleNode, children }, index) => (
			<div className="parent-folder" key={`${index}`}>
				<div>{titleNode}</div>
				<div>
					{children.map((list) => this.renderFolder(list))}
				</div>
			</div>
		));
		const { name, path, children, type } = folder;
		const dataFocusFile = `is-${path === `./${window.location.href.match(/wiki\/(.+)/)[1]}`}`;
		const filePattern = /.+\.(\w+)$/;
		const fileType = filePattern.test(path) ? path.match(filePattern)[1] : "folder";
		if (type === "folder") {
			return (
				<div className={styles.folder} key={`${Math.random()}`}>
					<a
						data-path={path}
						onClick={e => this.toggleFolder(e)}
						data-openFolder="false"
						data-focusFile={dataFocusFile}
					>
						<p className={styles["material-icons"]}>keyboard_arrow_right</p>
						<p className={styles["material-icons"]}>folder</p>
						{name}
					</a>
					<div ref={`ref-${path}`} className={styles.content}>
						{children.map((child: any) => this.renderFolder(child))}
					</div>
				</div>
			);
		}

		return (
			<div
				className={styles.file}
				key={`${Math.random()}`}
			>
				<a data-path={path} data-focusFile={dataFocusFile} href={`/wiki/${path.slice(2)}`} className={styles[fileType]}>
					{name}
				</a>
			</div>
		);
	}

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { style, className, focusFolder, ...attributes } = this.props;

		const { directories } = this.state;
		if (!directories) {
			return <div style={style} className={`${styles.container } ${ className}`} {...attributes} />;
		}

		return (
			<div style={style} className={`${styles.container } ${ className}`} {...attributes}>
				<div className={styles.tree}>
					{this.renderFolder(directories)}
				</div>
			</div>
		);
	}
}
