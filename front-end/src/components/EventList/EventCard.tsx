import {
	useState,
	useEffect
} from "react";
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography
} from "@material-ui/core";
import { Image } from "react-bootstrap";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { University } from "src/types/dropDownTypes";

// type imports
import { Event } from "../../types/eventTypes";

// CSS imports
import "./EventCard.css";
import { fetchUniversities } from "src/Utils/apiDropDownData";

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
	const [universities, setUniversities] = useState<Map<number, University>>(new Map<number, University>());

	const handleExpand = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
		setExpanded(isExpanded ? panel : false);
	};

	const classes = useStyles();

	useEffect(() => {
		fetchUniversities()
		.then((mappedUniversities: Map<number, University>) => {
			setUniversities(mappedUniversities)
			})
		}, []);

	return (
		<>
			{
				events.map((event: Event, index: number) => {
					const { rso, state } = event;
					const university: University | undefined = universities.get(event.schoolID);

					return (
						<div className="EventList">
							<Accordion
								expanded={expanded === ("panel_" + String(index))}
								onChange={handleExpand("panel_" + String(index))}
								>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									id={"card_" + String(index)}
								>
									<Typography className={classes.heading}>
										{event.name}
									</Typography>
									<Typography className={classes.secondaryHeading}>
										{(university === undefined) ? "University Name" : university.name}
									</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography className={classes.heading}>
										{rso.name}
									</Typography>
									<Typography>
										<Typography>
											{event.address}
										</Typography>
										<Typography>
											{state.name}
										</Typography>
										<Typography>
											{event.zip}
										</Typography>
										<Typography>
											{event.room}
										</Typography>
									</Typography>
									<div className="EventPictures">
										{event.eventPictures.map((picture: string, index: number) => {
											console.log(picture);
											return (
												<Image src={picture} />
											)
										})}
									</div>
							</AccordionDetails>
						</Accordion>
					</div>
					);
				})
			}
		</>
	)
	
}

export default EventCards
