import React from 'react';
import './ArtistHome.scss';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import artistData from '../../helpers/data/artistData';

import authData from '../../helpers/data/authData';
import Post from '../../Shared/Post/Post';
import postShape from '../../helpers/propz/PostShape';
import postData from '../../helpers/data/postData';

import Event from '../../Shared/Event/Event';
import eventShape from '../../helpers/propz/EventShape';
import eventData from '../../helpers/data/eventData';

class ArtistHome extends React.Component {
  static propTypes = {
    authed: PropTypes.bool.isRequired,
    artistId: PropTypes.number.isRequired,
    setSingleArtist: PropTypes.func.isRequired,
    post: postShape,
    event: eventShape,
  }

  state = {
    posts: [],
    events: [],
    postText: '',
    dateCreated: '',
  }

  getPostInfo = () => {
    artistData.getArtistPostByUid()
      .then((response) => {
        this.setState({ posts: response });
      })
      .catch((err) => console.error('could not get posts for artist: ', err));
  }

  getEventsInfo = () => {
    artistData.getArtistEventsByUid()
      .then((response) => {
        this.setState({ events: response });
      })
      .catch((err) => console.error('could not get events for artist: ', err));
  }

  componentDidMount() {
    this.getPostInfo();
    this.getEventsInfo();
    const d = new Date();
    const actualDate = d.toISOString();
    this.setState({ dateCreated: actualDate });
  }

  deletePost = (postId) => {
    postData.deletePost(postId)
      .then(() => {
        this.getPostInfo();
      })
      .catch((err) => console.error('could not delete post', err));
  }

  deleteEvent = (eventId) => {
    eventData.deleteEvent(eventId)
      .then(() => {
        this.getEventsInfo();
      })
      .catch((err) => console.error('could not delete event: ', err));
  }

  postTextChange = (e) => {
    e.preventDefault();
    this.setState({ postText: e.target.value });
  }

  submitPost = (e) => {
    e.preventDefault();
    const fbUid = authData.getUid();
    const { artist } = this.props.artist;
    console.error('this is the artist prop', artist);
    const newPost = {
      fbUid,
      artistId: this.props.artist.artistId,
      postText: this.state.postText,
      dateCreated: this.state.dateCreated,
    };
    console.error('new post =>', newPost);
    postData.createPost(newPost)
      .then(() => {
        artistData.getArtistPostByUid(authData.getUid())
          .then((response) => {
            this.setState({ postText: '' });
            this.setState({ posts: response });
          });
      })
      .catch((err) => console.error('could not add post', err));
  }

  updatePost = (postId) => {
    postData.editPost(postId)
      .then(() => {
        this.getArtistPostByUid(authData.getUid())
          .then((response) => {
            this.setState({ postText: '' });
            this.setState({ posts: response });
          });
      })
      .catch((err) => console.error('could not update post', err));
  }

  render() {
    const { posts, events } = this.state;
    const { authed, artist } = this.props;

    const buildPostCards = posts.map((post) => (
      <Post key={post.postId} artist={artist} post={post} deletePost={this.deletePost} updatePost={this.updatePost}/>
    ));
    const buildEventsCards = events.map((event) => (
      <Event key={event.eventId} artist={artist} event={event} deleteEvent={this.deleteEvent}/>
    ));
    const editPhotoLink = `photo/${artist.artistId}`;
    console.error(editPhotoLink);
    return (
      <div className="d-flex flex-wrap card">
        <div className="eventContainer">
        <Link className="btn btn-dark addEventBtn" to='/new/event'>Add Event</Link>
        {buildEventsCards}
        </div>
        <div className="artistCard">
          {
            authed ? <div className="card">
              <h5 className="card-header">{artist.artistName}</h5>
            <img className="artistImg card-img-top" src={artist.artistPhoto} alt="artist" />
            <div className="card-body">
              <p>{artist.city} || {artist.state} || {artist.genre}</p>
            </div>
          </div> : <h2> no artist to display</h2>
          }
        </div>
        <div className="card btnCard">
        <Link className="btn btn-danger" to={editPhotoLink}>add photo</Link>
        <button className="btn btn-danger" onClick={this.editartistEvent}>My Events</button>
        <button className="btn btn-danger" onClick={this.editartistEvent}>Followers</button>
        </div>
      <div className="postContainer">
        <div className="CreatePost">
        <div className="mb-3">
          <label htmlFor="post-postText">Make a New Post</label>
          <input type="text" className="form-control" id="post-postText" onChange={this.postTextChange} value={this.state.postText}/>
        </div>

          <button className="btn btn-dark" onClick={this.submitPost}>Submit</button>
        </div>
        {buildPostCards}
      </div>
      </div>
    );
  }
}

export default ArtistHome;
