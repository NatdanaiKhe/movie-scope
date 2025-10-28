function Footer() {
  return (
    <footer className="w-full h-fit flex flex-col items-center justify-center gap-4 bg-slate-900 text-white p-4">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} MovieScope. All rights reserved.
      </p>
      {/* <div className="flex justify-between items-center gap-4">
        <a
          href="/terms"
          className="text-sm text-gray-400 hover:text-yellow-400"
        >
          Terms & Conditions
        </a>
        <a
          href="/privacy"
          className="text-sm text-gray-400 hover:text-yellow-400"
        >
          Privacy Policy
        </a>
      </div> */}
    </footer>
  );
}

export default Footer;
