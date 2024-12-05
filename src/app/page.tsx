import AllMenu from "@/components/menus/all-menu";

export default function Order() {
  return (
    <div className="p-5 py-10 md:p-10">
      <div className="header flex w-full justify-center mb-10">
        <h1 className="text-5xl font-bold uppercase"><span className="text-[#fb6218]">Our</span> Menu</h1>
      </div>
      <div className="menu">
        <AllMenu />
      </div>
    </div>
  );
}