import * as React from "react";

export interface DataProps {
  fill?: string;
  width?: string | number;
  height?: string | number;
}

export interface ReactIconProps extends DataProps, React.HTMLAttributes<SVGElement> {}

export default class ReactIcon extends React.PureComponent<ReactIconProps> {
  static defaultProps: ReactIconProps = {
    fill: "#0078D7",
    width: 40
  };

  render() {
    const { fill, ...attributes } = this.props;
    return (
      <svg viewBox="0 0 40 40" {...attributes}>
      <g>
        <g>
          <path
            style={{ fill }}
            d="M27.7,37.9c-1.8,0-4-0.9-6.3-2.7c-3.2-2.5-6.4-6.3-9-10.8C6.8,14.7,5.8,5.1,10,2.7c4.2-2.4,12,3.2,17.6,12.9c5.6,9.7,6.7,19.2,2.4,21.7l0,0C29.3,37.7,28.6,37.9,27.7,37.9z M12.3,3.7c-0.6,0-1.1,0.1-1.5,0.4c-3,1.7-2.5,10,3,19.6c2.5,4.4,5.6,8,8.6,10.4c2.8,2.2,5.3,2.9,6.8,2l0,0c3-1.7,2.5-10-3-19.6C21.5,8.2,15.7,3.7,12.3,3.7z"
          />
        </g>
        <g>
          <path
            style={{ fill }}
            d="M12.2,37.9c-0.8,0-1.6-0.2-2.2-0.6c-4.2-2.5-3.2-12,2.4-21.7c2.6-4.5,5.8-8.4,9-10.8c3.4-2.6,6.4-3.3,8.6-2.1c4.2,2.5,3.2,12-2.4,21.7C22.8,32.6,16.6,37.9,12.2,37.9z M27.7,3.7c-1.5,0-3.3,0.8-5.3,2.4c-3,2.3-6.1,6-8.6,10.4c-5.5,9.6-6,17.8-3,19.6c3,1.7,9.9-2.8,15.4-12.4s6-17.8,3-19.6l0,0C28.8,3.8,28.3,3.7,27.7,3.7z"
          />
        </g>
        <g>
          <path
            style={{ fill }}
            d="M20,28.7C8.8,28.7,0,24.9,0,20s8.8-8.7,20-8.7s20,3.8,20,8.7S31.2,28.7,20,28.7z M20,12.8C9,12.8,1.6,16.5,1.6,20S9,27.2,20,27.2s18.4-3.7,18.4-7.2S31,12.8,20,12.8z"
          />
        </g>
        <g>
          <path
            style={{ fill }}
            d="M20,16.9c1.7,0,3.1,1.4,3.1,3.1c0,1.7-1.4,3.1-3.1,3.1c-1.7,0-3.1-1.4-3.1-3.1C16.9,18.3,18.3,16.9,20,16.9"
          />
        </g>
      </g>
      </svg>
    );
  }
}
