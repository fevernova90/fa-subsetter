import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { saveAndGenerate } from '../actions/iconActions';
import { pushError } from '../actions/notiActions';

const handleDownload = () => {
  fetch('/download')
    .then(resp => resp.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      // the filename you want
      a.download = 'css_webfonts.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(err => alert('oh no! ' + err));
};

function Generator(props) {
  const handleSave = () => {
    if (props.icons.length === 0) {
      props.pushError('No selected icons to save.');
      return;
    }
    props.saveAndGenerate(props.icons);
  };

  return (
    <div className='generator-section'>
      <h3>Generate CSS/Webfonts</h3>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleDownload}>Download</button>
    </div>
  );
}

Generator.propTypes = {
  icons: PropTypes.array.isRequired,
  saveAndGenerate: PropTypes.func.isRequired,
  pushError: PropTypes.func.isRequired
};

const mapStateToProps = state => ({ icons: state.icons.items });

export default connect(mapStateToProps, { saveAndGenerate, pushError })(
  Generator
);
