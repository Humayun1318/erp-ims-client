const LoginCredentials = ({
  setDemoCredentials,
}: {
  setDemoCredentials: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs space-y-1 border border-slate-700 shadow-lg">
        <p className="text-slate-400 text-[9px] uppercase tracking-wider">
          Demo ERP Access for evaluation purposes. Use the following credentials to log in:
        </p>
        <p className="text-emerald-400 text-[10px]">
          Admin: admin@gmail.com / Password@123{" "}
          <span className="text-slate-400 cursor-pointer hover:text-emerald-500 transition-colors duration-200 border-2 px-2 rounded-sm border-slate-400 hover:border-emerald-800">
            {" "}
            <button
              onClick={() =>
                setDemoCredentials("Admin: admin@gmail.com / Password@123")
              }
              className="text-white hover:text-emerald-500 p-1 cursor-pointer"
            >
              {" "}
              Click{" "}
            </button>{" "}
          </span>
        </p>
        <p className="text-blue-400 text-[10px]">
          Manager: manager@gmail.com / Password@123{" "}
          <span className="text-slate-400 cursor-pointer hover:text-emerald-500 transition-colors duration-200 border-2 px-2 rounded-sm border-slate-400 hover:border-emerald-800">
            {" "}
            <button
              onClick={() =>
                setDemoCredentials("Manager: manager@gmail.com / Password@123")
              }
              className="text-white hover:text-emerald-500 p-1 cursor-pointer"
            >
              {" "}
              Click{" "}
            </button>{" "}
          </span>
        </p>
        <p className="text-blue-400 text-[10px]">
          Employee: employee@gmail.com / Password@123{" "}
          <span className="text-slate-400 cursor-pointer hover:text-emerald-500 transition-colors duration-200 border-2 px-2 rounded-sm border-slate-400 hover:border-emerald-800">
            {" "}
            <button
              onClick={() =>
                setDemoCredentials("Employee: employee@gmail.com / Password@123")
              }
              className="text-white hover:text-emerald-500 p-1 cursor-pointer"
            >
              {" "}
              Click{" "}
            </button>{" "}
          </span>
        </p>
        <p className="text-blue-400 text-[10px]">
          Employee1: employee1@gmail.com / Password@123{" "}
          <span className="text-slate-400 cursor-pointer hover:text-emerald-500 transition-colors duration-200 border-2 px-2 rounded-sm border-slate-400 hover:border-emerald-800">
            {" "}
            <button
              onClick={() =>
                setDemoCredentials("Employee1: employee1@gmail.com / Password@123")
              }
              className="text-white hover:text-emerald-500 p-1 cursor-pointer"
            >
              {" "}
              Click{" "}
            </button>{" "}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginCredentials;
