import React from "react";
import { ISimState } from "../types";
import BaseView from "../views/base-view";

export interface ICanvasProps {
  simulation: ISimState;
  log?: (action: string, data: any) => void;
  onSimStateChange?: (newProps: Partial<ISimState>) => void;
}

export default class CanvasView extends React.Component<ICanvasProps> {
  container: React.RefObject<HTMLDivElement> = React.createRef();
  externalView?: BaseView;
  _rafId?: number;

  constructor(props: ICanvasProps) {
    super(props);
    if (this.container.current) {
      this.externalView = new BaseView(this.container.current, this.props.simulation);
    }
  }

  componentDidMount() {
    if (this.container.current) {
      this.externalView = new BaseView(this.container.current, this.props.simulation);
    }
    this.rafCallback = this.rafCallback.bind(this);
    this._rafId = requestAnimationFrame(this.rafCallback);
  }

  componentWillUnmount() {
    this._rafId && cancelAnimationFrame(this._rafId);
  }

  UNSAFE_componentWillReceiveProps(nextProps: ICanvasProps) {
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
