import React from "react";
import { ISimState } from "../types";
import OrbitView from "../views/base-view";

export interface ICanvasProps {
  simulation: ISimState;
  log?: (action: string, data: any) => void;
  onSimStateChange?: (newProps: Partial<ISimState>) => void;
}

export default class CanvasView<TProps extends ICanvasProps> extends React.Component<TProps> {
  container: React.RefObject<HTMLDivElement> = React.createRef();
  externalView?: OrbitView;
  _rafId?: number;

  constructor(props: TProps) {
    super(props);
    if (this.container.current) {
      this.externalView = new OrbitView(this.container.current, this.props.simulation);
    }
  }

  componentDidMount() {
    if (this.container.current) {
      this.externalView = new OrbitView(this.container.current, this.props.simulation);
    }
    this.rafCallback = this.rafCallback.bind(this);
    this._rafId = requestAnimationFrame(this.rafCallback);
  }

  componentWillUnmount() {
    this._rafId && cancelAnimationFrame(this._rafId);
  }

  UNSAFE_componentWillReceiveProps(nextProps: TProps) {
    this.externalView?.setProps(nextProps.simulation);
  }

  shouldComponentUpdate() {
    // Never update component as it's based on canvas.
    return false;
  }

  // requestAnimationFrame callback.
  rafCallback(timestamp: number) {
    this.externalView?.render?.(timestamp);
    requestAnimationFrame(this.rafCallback);
  }

  resize() {
    this.externalView?.resize?.();
  }

  render() {
    return (
      <div ref={this.container} style={{width: "100%", height: "100%"}}>
        {/* Canvas will be inserted here by the external view. */}
      </div>
    );
  }
}
