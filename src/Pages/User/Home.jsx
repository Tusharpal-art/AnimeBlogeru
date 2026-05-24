import RecentPost from "../../Components/RecentPost";
import { useGetRecentPostsQuery } from "../../services/apiSlice";
import { PostSection } from "../../Components/PostSection";
import Footer from "../../Components/Footer";

function Home() {
  const { data: posts,  isError } = useGetRecentPostsQuery();
 console.log(posts)
  return (
    <main className="home-wrapper">
      <div className="outerContainer">
        <div className="hero-content">
          <h1>Konichiiwa こんにちは to Burogu desu</h1>
          <p>
            (こんにちは) is a Japanese greeting that means "hello" or "good
            afternoon". It is used during the daytime, bringing a warm start to
            your reading journey.
          </p>
        </div>
      </div>

      {isError && (
        <p className="status-msg">Gomen nasai! Something went wrong.</p>
      )}

     <div className="blog-home-page">
      {/* 1. Recent Posts (Type 2) */}
      <PostSection title="Recent Posts" type={2} limit={6} />

      {/* 2. Popular Posts (Type 3) */}
      <PostSection title="Popular Posts" type={3} limit={6} />

      {/* 3. All Posts (Type 1) with See All button */}
      <PostSection title="All Blogs" type={1} limit={30} showSeeAll={true} />
    </div>

    <Footer />
    </main>
  );
}

export default Home;
