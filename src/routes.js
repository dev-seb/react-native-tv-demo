
import Home from "./components/Home";
import InputDemo from "./components/demos/InputDemo";
import FocusDemo from "./components/demos/FocusDemo";
import EventsDemo from "./components/demos/EventsDemo";
import ScrollDemo from "./components/demos/ScrollDemo";
import VideoDemo from "./components/demos/VideoDemo";

const routes = {
  home: {screen: Home},
  events: {screen: EventsDemo},
  focus: {screen: FocusDemo},
  scroll: {screen: ScrollDemo},
  input: {screen: InputDemo},
  video: {screen: VideoDemo},
};

export default routes;