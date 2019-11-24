import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dismissNoti } from '../actions/notiActions';

function NotificationBar(props) {
  const textColor = props.isErrorNotification
    ? { color: 'red' }
    : { color: 'green' };
  const showBar = props.showNotification ? (
    <div className='notification-bar'>
      <div className='notification-text' style={textColor}>
        <p>{props.notificationText}</p>
      </div>
      <div className='notification-dismiss-button'>
        <button onClick={props.dismissNoti}>X</button>
      </div>
    </div>
  ) : null;

  return <React.Fragment>{showBar}</React.Fragment>;
}

NotificationBar.propTypes = {
  showNotification: PropTypes.bool.isRequired,
  notificationText: PropTypes.string,
  dismissNoti: PropTypes.func.isRequired,
  isErrorNotification: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  showNotification: state.notifications.show,
  notificationText: state.notifications.text,
  isErrorNotification: state.notifications.isError
});

export default connect(mapStateToProps, { dismissNoti })(NotificationBar);
