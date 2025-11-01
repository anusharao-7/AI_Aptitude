import Home from "../Home";

export default function HomeExample() {
  return <Home onCategorySelect={(cat) => console.log("Selected category:", cat)} />;
}
