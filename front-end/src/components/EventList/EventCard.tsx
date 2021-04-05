import { Accordion, AccordionSummary, AccordionDetails, Typography} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useState } from "react";

// type imports
import { Event } from "src/types/eventTypes";

type EventCardsProps = {
	events: Array<Event>
}

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

function EventCards(props: EventCardsProps): JSX.Element
{
	const { events } = props;
	const [expanded, setExpanded] = useState<string | false>(false);

	const handleExpand = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
		setExpanded(isExpanded ? panel : false);
	};

	const classes = useStyles();

	return (
		<>
			{
				events.map((event: Event, index: number) => {
					const { name, rso, university } = event;

					return (
						<Accordion expanded={expanded === ("panel_" + String(index))} onChange={handleExpand("panel_" + String(index))}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							id={"card_" + String(index)}
						>
							<Typography className={classes.heading}>{name}</Typography>
							<Typography className={classes.secondaryHeading}>{rso?.name}</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography className={classes.heading}>
								University
							</Typography>
							<Typography>
								{university?.name}
							</Typography>
						</AccordionDetails>
					</Accordion>
					);
				})
			}
		</>
	)
	
}

export default EventCards
