import { Outlet } from "react-router";

function AuthLayout() {
  return (
    <section className="flex flex-row h-screen">
      <div className="hidden lg:block lg:w-[34%] xl:w-[30%] h-screen relative">
        <div
          className="absolute inset-0 -z-10 h-full w-full bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url(/illustrations/auth.png)` }}
        ></div>

        <div className="p-8 h-4/5 flex flex-col justify-between">
          <img
            src={"/icons/kairos-logo-white.png"}
            alt="kairos-logo"
            className="cursor-pointer w-28 h-11"
          />

          <div className="space-y-2 w-[85%] xl:w-[80%">
            <h1 className="text-2xl text-white font-bold">
              Find jobs, competitions & mentorship.
            </h1>
            <p className="text-white text-sm">
              You are just a few clicks away.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[66%] xl:w-[70%]">
        <Outlet />
      </div>
    </section>
  );
}

export default AuthLayout;
