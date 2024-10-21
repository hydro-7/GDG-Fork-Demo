import React, { useState, useEffect } from "react";
import "./Author.css";

import heart from "../../assets/homeIcons/heart.png";
import followers from "../../assets/homeIcons/follow.png";
import followings from "../../assets/homeIcons/followers.png";
import blog from "../../assets/homeIcons/blog.png";
import views from "../../assets/homeIcons/views.png";

import Loader from "../../components/Loader/Loader";
import GhostLoader from "../../components/GhostLoader/GhostLoader";

import { useParams } from "react-router-dom";
import { useAuthContext } from "../../contexts/auth";
import { useTheme } from "../../contexts/theme";
import { toast } from "react-toastify";
import BlogCard2 from "../../components/BlogCard2/BlogCard2";

import { capitalizeFirstLetter, truncate } from "../../utils/stringFunctions";

function Author() {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [published, setPublished] = useState([]);
  const [followed, setFollowed] = useState(false);

  const [imgLoading, setImgLoading] = useState(true);

  const { id } = useParams();
  const { user } = useAuthContext();
  const { theme } = useTheme();

  const followAuthor = async () => {
    await fetch(`/api/users/follow/${id}`, {
      method: "POST",
      headers: { Authorization: user.token },
    })
      .then((res) => res.json())
      .then((data) => {
        setFollowed(!followed);
        toast.success(data.message);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const fetchAuthor = async () => {
    setLoading(true);
    fetch(`/api/users/author/${id}`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setAuthor(data);
        setFollowed(data.followers.includes(user.id));
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchPublishedByAuthor = async () => {
    setLoading(true);
    await fetch(`/api/blogs/get-published/${id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPublished(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (id && user) {
      fetchAuthor();
      fetchPublishedByAuthor();
    }
  }, [id, user]);

  const handleImageLoaded = () => {
    setImgLoading(false);
  };

  if (loading) return <Loader />;
  else
    return (
      <div id="author-page" className={`author-page-${theme}`}>
        <div className="author-details">
          <div className="top-header">
            <div className="author-header">
              <div className="line"></div>
              <p>Author Details</p>
            </div>

            <button className="follow-btn" onClick={followAuthor}>
              {!followed ? "Follow" : "Unfollow"}
            </button>
          </div>

          <div className="author-info2">
            <img
              onLoad={handleImageLoaded}
              className="author-dp"
              src={author?.user?.profile_image_url}
              alt=""
              style={{ display: imgLoading ? "none" : "block" }}
            />
            {imgLoading && (
              <GhostLoader width={"8rem"} height={"8rem"} radius={"50%"} />
            )}
            <div className="author-text">
              <h1>{capitalizeFirstLetter(author?.user?.full_name)}</h1>
              <div className="author-personal">
                <div className="author-sub-text">
                  <p>Username</p>
                  <p>@{author?.user?.username}</p>
                </div>
                <div className="author-sub-text">
                  <p>Email</p>
                  <p>{author?.user?.email}</p>
                </div>
                <div className="author-sub-text">
                  <p>Joined</p>
                  <p>{author?.user?.created_at}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="author-stats">
            <div className="stat">
              <div className="stat-icon">
                <img src={blog} alt="" />
              </div>
              <div>
                <h2>{author?.blogs?.length}</h2>
                <p>Blogs</p>
              </div>
            </div>
            <div className="stat">
              <div className="stat-icon">
                <img src={followers} alt="" />
              </div>
              <div>
                <h2>{author?.followers?.length}</h2>
                <p>Followers</p>
              </div>
            </div>
            <div className="stat">
              <div className="stat-icon">
                <img src={followings} alt="" />
              </div>
              <div>
                <h2>{author?.user?.following?.length}</h2>
                <p>Following</p>
              </div>
            </div>
            <div className="stat">
              <div className="stat-icon">
                <img src={heart} alt="" />
              </div>
              <div>
                <h2>{author?.likes}</h2>
                <p>Total Likes</p>
              </div>
            </div>
            <div className="stat">
              <div className="stat-icon">
                <img src={views} alt="" />
              </div>
              <div>
                <h2>{author?.views}</h2>
                <p>Total Views</p>
              </div>
            </div>
          </div>
        </div>
        <div className="author-blogs">
          {published.map((blog) => (
            <BlogCard2 blog={blog} key={blog._id} />
          ))}
        </div>
      </div>
    );
}

export default Author;