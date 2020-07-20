import { useQuery } from '@apollo/react-hooks';
import { makeStyles, NativeSelect } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import Slider from "@material-ui/core/Slider";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import ApolloClient, { gql } from 'apollo-boost';
import PropTypes from 'proptypes';
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { HIDE_PROGRESS_MODAL, SHOW_PROGRESS_MODAL } from "../../../reducers/progressModal";
import { SET_ERROR_SNACKBAR } from "../../../reducers/snackbar";


const useStyles = makeStyles(theme => ({
    teste: {
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(1),
        verticalAlign: 'bottom'
    }
}))

export const client = new ApolloClient({
    uri: process.env.REACT_APP_YOUTUBE_SERVICE_URL,
});

export const YOUTUBE_SUBTITLES_QUERY = gql`
    query getSubtitles($url: String!){
        subtitles: getAvailableVideoSubtitles(url: $url){
            languageCode
            languageName
            isAutomatic
            downloadUrl
        }
    }
`;

const DEFAULT_MIN_WORD_LENGTH = 3;

function Form(props) {
    const { url, onError, showProgressModal, hideProgressModal, dispatch } = props;
    const { loading, error, data } = useQuery(YOUTUBE_SUBTITLES_QUERY, { client, variables: { url } });
    const [allowAsr, setAllowAsr] = useState(true); // automatic speech recognition
    const classes = useStyles();

    useEffect(() => {
        if (loading) {
            showProgressModal("Wait ...", "Searching subtitles ...");
        } else {
            hideProgressModal();
        }

    }, [loading, hideProgressModal, showProgressModal])

    useEffect(() => {
        if (error && onError) {
            const messages = error.graphQLErrors.map(({ message }) => message).join(',');
            dispatch({ type: 'HIDE_FORM' })
            onError(messages)
        }
    }, [onError, error, dispatch])

    useEffect(() => {
        if (!loading && !error) {
            dispatch({ type: 'SET_MIN_WORD_LENGTH', minWordLength: DEFAULT_MIN_WORD_LENGTH })
            dispatch({ type: 'SET_SUBTITLE', subtitle: data.subtitles[0] });
        }
    }, [data, dispatch, error, loading])

    if (loading || error) {
        return null;
    }

    const onSliderChange = (evt, value) => {
        dispatch({ type: 'SET_MIN_WORD_LENGTH', minWordLength: value })
    };

    const onLanguageChange = evt => {
        const subtitleIndex = parseInt(evt.target.value, 10);
        dispatch({ type: 'SET_SUBTITLE', subtitle: data.subtitles[subtitleIndex] });
    };

    return (
        <>
            <Grid item xs={12}>
                <FormControl>
                    <InputLabel htmlFor="language-select">Language</InputLabel>
                    <NativeSelect
                        inputProps={{
                            id: "language-select"
                        }}
                        fullWidth
                        defaultValue='0'
                        onChange={onLanguageChange}>
                        {data.subtitles.filter(({ isAutomatic }) => !isAutomatic || allowAsr).map((subtitle, index) => (
                            <option value={index} key={subtitle.languageName}>
                                {subtitle.languageName}
                            </option>
                        ))}
                    </NativeSelect>
                </FormControl>
                <FormControl className={classes.teste}>
                    <FormControlLabel
                        labelPlacement="end"
                        control={
                            <Switch
                                color="primary"
                                checked={allowAsr}
                                edge='start'
                                onChange={(evt) => setAllowAsr(evt.target.checked)}
                            />
                        }
                        label="Allow auto generated subtitles"
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <Typography
                    id="discrete-slider"
                    gutterBottom>
                    Minimum word length
                </Typography>
                <Slider
                    step={1}
                    marks
                    defaultValue={DEFAULT_MIN_WORD_LENGTH}
                    valueLabelDisplay="auto"
                    onChange={onSliderChange}
                    min={1}
                    max={10}
                />
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel
                    control={
                        <Switch
                            color="primary"
                            defaultValue={false}
                            onChange={(evt) => dispatch({ type: 'SET_ONLY_NEW_WORDS', onlyNewWords: evt.target.checked })}
                        />
                    }
                    label="Only new words"
                />
            </Grid>
        </>
    );
}

const mapDispatchToProps = dispatch => ({
    onError: message => dispatch({ type: SET_ERROR_SNACKBAR, message }),
    showProgressModal: (title, description) =>
        dispatch({ type: SHOW_PROGRESS_MODAL, description, title }),
    hideProgressModal: () => dispatch({ type: HIDE_PROGRESS_MODAL })
});

Form.propTypes = {
    url: PropTypes.string,
    onError: PropTypes.func,
    showProgressModal: PropTypes.func,
    hideProgressModal: PropTypes.func,
    dispatch: PropTypes.func
}

export default connect(null, mapDispatchToProps)(Form);
