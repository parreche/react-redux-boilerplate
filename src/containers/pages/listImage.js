import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { getTrendingImage, searchImage } from '../../action/image';
import { Button, List, Divider, Input, message } from 'antd';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { generateTitleFromGiphySlug } from '../../model/utils';

/**
 * This component corresponding to the listImage view
 * It has a button to trigger an API call, then generate a list
 * When clicking on element of the list, user will be navigate to viewPage to see the gif image
 */
export class ListImage extends React.Component {
  /**@constructor
   * @param {Object} props
   * @param {Object} props.location - location is from redux-react-router, which maintains current page and variables send to the page
   * @param {Function} props.changePage - changePage is a function which can navigation from a page to another
   * @param {Function} props.getTrendingImage  - getTrendingImage will return a list of image which is trending on giphy
   */
  constructor(props) {
    super(props);
    this.state = {
      imageList: []
    };
  }

  componentDidMount() {
    message.success('Land on listing page', 1);
  }

  /**
   * dispatch the getTrendingImage action and return a list of image
   */
  listTrendingImage = () => {
    this.props.getTrendingImage();
  };

  /**
   * dispatch the searchImage action, which will search the images by keyword
   */
  searchImage = event => {
    this.props.searchImage(event.target.value);
  };

  /**
   * getDerivedStateFromProps will be called every time before render (it is new React lifecyle function to replace the old componentWillReceiveProps)
   * So in order to avoid too frequent render, we need to compare the data then decide do we need to re-render
   * @param {Object} nextProps
   * @param {Object} prevState
   * @param {Array} nextProps.imageList - imageList from nextProps (new one)
   * @param {Array} prevState.imageList - imageList which now existed in state
   * @returns {state} - will return new imageList if there's change
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (isEqual(nextProps.imageList, prevState.imageList)) {
      return null;
    } else {
      return {
        imageList: nextProps.imageList
      };
    }
  }

  /**
   * @param {string} imageUrl - url of image which pass to next page
   * @param {string} imageTitle - title of image which pass to next page
   */
  navigateToImageView = (imageUrl, imageTitle) => {
    const { changePage } = this.props;
    changePage('viewImage', { imageUrl, imageTitle });
  };

  render() {
    const { imageList } = this.state;
    return (
      <div className="list-image-container">
        <Divider>Get Trending Giphys</Divider>
        <Button onClick={this.listTrendingImage} className="full-with-btn" type="primary">
          Click To Get Trending Giphys
        </Button>
        <Divider>or Search By Keyword</Divider>
        <Input onInput={this.searchImage} placeholder="Giphy Keyword" />
        <Divider dashed />
        {imageList && (
          <List
            header={<div style={{ fontWeight: 'bold' }}>List Of Trending Giphy URL</div>}
            className="image-list"
            bordered
            dataSource={imageList}
            renderItem={item => (
              <List.Item
                onClick={this.navigateToImageView.bind(
                  this,
                  item.images.downsized_medium.url,
                  item.title || generateTitleFromGiphySlug(item.slug)
                )}>
                {item.title || generateTitleFromGiphySlug(item.slug)}
              </List.Item>
            )}
          />
        )}
      </div>
    );
  }
}

ListImage.propTypes = {
  location: PropTypes.object,
  changePage: PropTypes.func,
  getTrendingImage: PropTypes.func,
  searchImage: PropTypes.func
};

export const mapStateToProps = state => {
  return {
    imageList: state.image.imageList
  };
};

export const mapDispatchToProps = dispatch => ({
  getTrendingImage: () => dispatch(getTrendingImage()),
  searchImage: keyword => dispatch(searchImage(keyword)),
  changePage: (route, params) => dispatch(push(route, params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListImage);
