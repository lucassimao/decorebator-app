import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
    header: {
        position: "relative",
      },
    quizzItem: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        listStyleType: 'none',
        ...theme.typography.subtitle1
    },

    quizzItemWrong: {
        border: '1px solid red'
    }
    ,
    quizzItemCorrect: {
        border: '1px solid green'
    },
    card: {
        margin: theme.spacing(1, 0)
    }

}));