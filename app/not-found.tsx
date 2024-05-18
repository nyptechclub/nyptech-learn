import Link from "next/link";

const notfound = () => {
    return ( <div className="hero min-h-screen bg-base text-base-content">
      <div className="hero-content  flex-col">
      <span className="text-4xl font-extrabold tracking-tighter">404</span>
      <h1 className="text-2xl font-extrabold tracking-tighter">Uh oh. I think you&apos;re lost.</h1>
      <p className=" md:text-xl/relaxed">
        It looks like the page you&apos;re searching for doesn&apos;t exist.
      </p>
    <Link
      className="btn mt-4"
      href="/"
    >
      Back to Home
    </Link>
      </div>
      
  </div>);
}
 
export default notfound;