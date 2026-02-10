import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const logo =
    "https://epearlacademy.com/pluginfile.php/1/theme_alpha/alphasettingsimgs/0/finallogo.png";

  const landing_page_image =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB5JtIei2YSCt2dhrhQvl8aMrwR7Hj2XP2D_MZtlUt8_2AeQIQHgIl67uWG4O_6xlYLoh5eAthaQahYJ02vxbIP9gq2XDBMH_i9aYd_Rj3SogHsPS9tN63ou63CgKql_N6Wek2VoQVQ75aCZO5FGfuabheaxYhpqLPeBHpUhAL0-2XOlIHV7NCvtRVj48dB-RHYrJlJJB97v-T80bWc0F0YzWMt7UwdWJBaijvTh910xBKb1VBzxzR6ajrOf6KMh3PFwrRDhDvbydM";

  const featured_courses_data = [
    {
      id: 1,
      title: "Web Development",
      description:
        "Learn the basics of HTML, CSS, and JavaScript to build your first responsive website.",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAN8NVMBdLUCDOL-663ZGg8PCvEWeWjYgKTm4XOSWqtE9obNGX0DlxdCdi8un3TRgotmExE_LmXAN1o86uakuBzYxXwK_bqSZf7nVXgTZnSk_zXcgqz5WLmWw1BRoJHUFJOOZz0yjI6oeEFVoMflK5RE10qi0srhQ-PfwNSm5G0Hv-7qxrfi-tTqKqH0uBmTWMTFycatxVZJ6bF0efi-eCCNZkBs9VWcWBaOlXz3M7uzUD6Dnz4vgzGhfocU1_OBhpx7osCg5KMyM4",
    },
    {
      id: 2,
      title: "UI/UX Design Principles",
      description:
        "Master the art of user interface and experience design with real-world projects.",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCUNDixuVYP7xdqsseSGVdSEuiCDNQ1NNQ3YXir5VNEJRq-vuzSwXgdSvNB7qtU4yv6yi0W7sXHOVqVPg01d7VEzCNcE28hmbbjNdqVBFBWmKzoTV_IeBVq_RneItpmM6ts5wE8jbdOcTr_KbuL5JhHpr9Ykmuf66mfs1pDOeeK72b4SwWsXMDeSRsuyuL3lI7uxOvWcuQUYvUXagkTQfoq8Rq0oZvdH5b4ToogWcLglFUaqQGxW_8ZHvPQeCJ0f0Y1JxdfRdMRQiw",
    },
    {
      id: 3,
      title: "Data Science for Beginners",
      description:
        "An introduction to data analysis, visualization, and machine learning using Python.",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBgC8aDCRzeEPd7txnwqnwGU8xLdvBA7Sooxy5PKegrDOj_GY09Osk3FeNcTumHOTc6batcN11dF7MXrpcNLklu0--hqMBpiX6rql8tinz8wgB9ph-vn2NRZ8EJHcGPKIhzzx5q1cQDYQikNKRi3m6crtso7bnA_PwPq7ZmBKnyodCYTBjCGGuvRaIOFpWV7ErMe0ejnN80sMSInE-DlmWNXXwjPt1NQoGY9u4ILxyk3nO1cd3iln5X3Ij74uidYAzRkJvKhUSBFc8",
    },
  ];

  const footer_data = [
    {
      id: 1,
      title: "Platform",
      link_to: [
        {
          label: "Browse Courses",
          href: "",
        },
        {
          label: "Mentorship",
          href: "",
        },
        {
          label: "Pricing",
          href: "",
        },
      ],
    },
    {
      id: 2,
      title: "Company",
      link_to: [
        {
          label: "About Us",
          href: "",
        },
        {
          label: "Careers",
          href: "",
        },
        {
          label: "Contact",
          href: "",
        },
      ],
    },
    {
      id: 3,
      title: "Legal",
      link_to: [
        {
          label: "Terms of Service",
          href: "",
        },
        {
          label: "Privacy Policy",
          href: "",
        },
      ],
    },
  ];

  return (
    <main className="h-full overflow-y-auto">
      <nav className="flex justify-between items-center px-4 md:px-10 lg:px-40 h-20 shadow-sm sticky top-0 z-100 backdrop-blur-md">
        <Image src={logo} width={100} height={100} alt="logo" />
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8 text-(--secondary)">
            <Link href="#" className="text-sm font-medium">
              Features
            </Link>
            <Link href="#" className="text-sm font-medium">
              Courses
            </Link>
            <Link href="#" className="text-sm font-medium">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-(--primary)">
              Log In
            </Link>
            <Link
              href="#"
              className="flex h-10 px-5 items-center justify-center rounded-lg bg-(--primary) text-white text-sm font-bold shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="200"
          viewBox="0 0 24 24"
          className="size-10 md:hidden"
        >
          <path
            fill="currentColor"
            d="M4 6a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1m0 6a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1m1 5a1 1 0 1 0 0 2h14a1 1 0 1 0 0-2z"
          />
        </svg>
      </nav>
      <section className="flex flex-col-reverse lg:flex-row items-center gap-12 px-4 md:px-10 lg:px-40 py-12 md:py-20">
        <div className="flex flex-col gap-4 lg:w-1/2">
          <span className="max-w-max px-3 py-1 rounded-full bg-(--primary)/10 text-(--primary) text-xs font-bold uppercase tracking-wider">
            NEW SEASON AVAILABLE
          </span>
          <p className="text-4xl md:text-5xl lg:text-6xl leading-[1.1] font-black tracking-tight text-(--secondary)">
            Unlock Your Potential with Expert-Led Courses
          </p>
          <p className="text-lg md:text-xl text-(--secondary)/60 font-normal leading-relaxed max-w-lg">
            Join a community of s and educators. Master new skills in design,
            coding, and business today with our structured learning paths.
          </p>
          <div className="flex flex-col gap-4 w-full md:flex-row">
            <button className="h-12 px-8 rounded-lg bg-(--primary) text-(--foreground) text-base font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all transform hover:-translate-y-0.5 cursor-pointer">
              Start Learning
            </button>
            <button className="flex items-center justify-center gap-2 h-12 px-8 rounded-lg border border-(--secondary)/10 text-(--secondary) text-base font-bold hover:bg-gray-50 transition-colors cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="200"
                height="200"
                viewBox="0 0 50 50"
                className="size-5"
              >
                <g
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="5"
                >
                  <path
                    stroke="currentColor"
                    d="m33.333 25l-12.5 8.333V16.667z"
                  />
                  <path
                    stroke="currentColor"
                    d="M25 43.75c10.355 0 18.75-8.395 18.75-18.75S35.355 6.25 25 6.25S6.25 14.645 6.25 25S14.645 43.75 25 43.75"
                  />
                </g>
              </svg>
              <span>Watch Demo</span>
            </button>
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm text-(--secondary)/60">
            <div className="flex -space-x-2">
              <div className="size-8 bg-amber-500 rounded-full border-2 border-(--foreground)"></div>
              <div className="size-8 bg-red-500 rounded-full border-2 border-(--foreground)"></div>
              <div className="size-8 bg-green-500 rounded-full border-2 border-(--foreground)"></div>
            </div>
            <p>Trusted by 10,000+ s</p>
          </div>
        </div>

        <Image
          src={landing_page_image}
          width={100}
          height={100}
          alt="logo"
          className="aspect-square w-full max-h-125 rounded-lg shadow-2xl bg-(--secondary)/10 object-cover md:aspect-video lg:aspect-square lg:w-1/2"
        />
      </section>
      <section>
        <header className="flex flex-col gap-4 px-4 md:px-10 lg:px-40 pt-10 pb-4">
          <p className="text-(--secondary) text-3xl font-bold leading-tight tracking-tight">
            Featured Courses
          </p>
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <p className="text-(--secondary)/60 text-base">
              Explore our top-rated classes for this month
            </p>
            <Link
              href="#"
              className="font-bold text-(--primary) hover:underline flex items-center gap-1"
            >
              <span>View All Courses</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="200"
                height="200"
                viewBox="0 0 24 24"
                className="size-5"
              >
                <path
                  fill="currentColor"
                  d="m18 12l.354-.354l.353.354l-.353.354zm-12 .5a.5.5 0 0 1 0-1zm8.354-4.854l4 4l-.708.708l-4-4zm4 4.708l-4 4l-.708-.708l4-4zM18 12.5H6v-1h12z"
                />
              </svg>
            </Link>
          </div>
        </header>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8 px-4 md:px-10 lg:px-40 pb-20">
          {featured_courses_data?.map((item) => {
            return (
              <div
                key={item?.id}
                className="group grid place-items-end rounded-lg shadow-sm hover:shadow-xl transition-all overflow-hidden"
              >
                <Image
                  src={item?.image_url}
                  width={100}
                  height={100}
                  alt="logo"
                  className="aspect-3/2 md:aspect-square w-full rounded-lg shadow-2xl bg-(--secondary)/10 col-[1/2] row-[1/2] filter-[brightness(0.8)] object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="col-[1/2] row-[1/2] z-10 px-4 py-8 flex flex-col gap-3 text-(--foreground) backdrop-blur-[2px] rounded-b-lg">
                  <p className="text-lg font-bold leading-snug">
                    {item?.title}
                  </p>
                  <p className="text-sm line-clamp-2">{item?.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="flex flex-col items-center bg-(--primary)/10 px-4 md:px-10 lg:px-40 py-20 text-center">
        <div className="flex justify-center items-center size-15 rounded-full bg-(--primary)/10 mb-6 p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="200"
            viewBox="0 0 24 24"
            className="size-7.5 text-(--primary)"
          >
            <path
              fill="currentColor"
              d="m5.65 10.025l1.95.825q.35-.7.725-1.35t.825-1.3l-1.4-.275l-2.1 2.1ZM9.2 12.1l2.85 2.825q1.05-.4 2.25-1.225t2.25-1.875q1.75-1.75 2.738-3.887T20.15 4q-1.8-.125-3.95.863T12.3 7.6q-1.05 1.05-1.875 2.25T9.2 12.1Zm4.45-1.625q-.575-.575-.575-1.412t.575-1.413q.575-.575 1.425-.575t1.425.575q.575.575.575 1.413t-.575 1.412q-.575.575-1.425.575t-1.425-.575Zm.475 8.025l2.1-2.1l-.275-1.4q-.65.45-1.3.812t-1.35.713l.825 1.975ZM21.95 2.175q.475 3.025-.587 5.888T17.7 13.524L18.2 16q.1.5-.05.975t-.5.825l-4.2 4.2l-2.1-4.925L7.075 12.8L2.15 10.7l4.175-4.2q.35-.35.838-.5t.987-.05l2.475.5q2.6-2.6 5.45-3.675t5.875-.6Zm-18.025 13.8q.875-.875 2.138-.887t2.137.862q.875.875.863 2.138t-.888 2.137q-.625.625-2.087 1.075t-4.038.8q.35-2.575.8-4.038t1.075-2.087Zm1.425 1.4q-.25.25-.5.913t-.35 1.337q.675-.1 1.338-.338t.912-.487q.3-.3.325-.725T6.8 17.35q-.3-.3-.725-.288t-.725.313Z"
            />
          </svg>
        </div>
        <p className="max-w-2xl text-(--secondary) text-3xl md:text-4xl font-bold leading-tight mb-4">
          Ready to start your learning journey?
        </p>
        <p className="max-w-2xl text-(--secondary)/60 text-base md:text-lg mb-8">
          Join thousands of s and start mastering new skills today. Whether you
          want to learn a new language, code, or design, we have something for
          you.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <button className="h-12 px-8 rounded-lg bg-(--primary) text-(--foreground) text-base font-bold shadow-sm shadow-(--primary)/20 hover:bg-(--primary)/90 transition-all transform hover:-translate-y-0.5 cursor-pointer">
            Start Learning
          </button>
          <button className="h-12 px-8 rounded-lg bg-(--foreground) border border-(--secondary)/10 text-(--secondary) text-base font-bold hover:bg-gray-50 transition-colors cursor-pointer">
            Watch Demo
          </button>
        </div>
      </section>
      <footer className="flex flex-col gap-10 px-4 md:px-10 lg:px-40 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          <div>
            <p className="text-(--secondary) text-lg font-bold mb-4">
              Epearl Academy
            </p>
            <p className="text-sm text-(--secondary)/60">
              Empowering s worldwide with accessible, high-quality education
              from expert instructors.
            </p>
          </div>
          <div className="flex flex-wrap gap-16">
            {footer_data?.map((item) => {
              return (
                <div key={item?.id} className="flex flex-col gap-3">
                  <p className="uppercase text-sm font-bold text-(--secondary) tracking-wider">
                    {item?.title}
                  </p>
                  {item?.link_to?.map((link, index) => {
                    return (
                      <Link
                        key={index}
                        href={link?.href}
                        className="text-sm text-(--secondary)/60"
                      >
                        {link?.label}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between gap-4 items-center pt-8 border-t border-(--secondary)/10">
          <p className="text-sm text-(--secondary)/60">
            © 2025 Epearl Academy. All rights reserved.
          </p>
          <div className="flex gap-4">
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="200"
                height="200"
                viewBox="0 0 24 24"
                className="size-5 text-(--secondary)/60"
              >
                <path
                  fill="currentColor"
                  d="M17.751 3h3.067l-6.7 7.625L22 21h-6.172l-4.833-6.293L5.464 21h-3.07l7.167-8.155L2 3h6.328l4.37 5.752zm-1.076 16.172h1.7L7.404 4.732H5.58z"
                />
              </svg>
            </button>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="200"
                height="200"
                viewBox="0 0 32 32"
                className="size-5 text-(--secondary)/60"
              >
                <path
                  fill="currentColor"
                  d="M27.25 3.125h-22a2 2 0 0 0-2 2v22a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2v-22a2 2 0 0 0-2-2zM11.22 26.78h-4v-14h4v14zm-2-15.5c-1.384 0-2.5-1.118-2.5-2.5s1.116-2.5 2.5-2.5s2.5 1.12 2.5 2.5s-1.118 2.5-2.5 2.5zm16 15.5h-4v-8.5c0-.4-.404-1.054-.688-1.212c-.375-.21-1.26-.23-1.665-.034l-1.648.793v8.954h-4v-14h4v.615c1.582-.723 3.78-.652 5.27.184c1.58.885 2.73 2.863 2.73 4.7v8.5z"
                />
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}
