import { Accordion, AccordionSummary, AccordionDetails, Typography} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useState } from "react";

// type imports
import { Event } from "src/types/eventTypes";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  }),
);

function EventCard(event: Event, index: number): JSX.Element
{
	const classes = useStyles();
	const [expanded, setExpanded] = useState<string | false>(false);

	const handleExpand = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

	return (
		<Accordion expanded={expanded === ("panel_" + String(index))} onChange={handleExpand("panel_" + String(index))}>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				id={"card_" + String(index)}
			>
				<Typography className={classes.heading}>{event.name}</Typography>
				<Typography className={classes.secondaryHeading}>{event.rso.name}</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Typography>
					Test
				</Typography>
			</AccordionDetails>
		</Accordion>
	);
}

export default EventCard
