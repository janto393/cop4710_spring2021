import {
	useState,
	useEffect
} from "react";
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Grid,
	Typography,
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

const NUM_PICTURES_PER_ROW: number = 2;

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
		container: {
			display: "grid",
			gridTemplateColumns: ("repeat(" + String(NUM_PICTURES_PER_ROW) + ", 1fr)"),
			gridGap: theme.spacing(3),
		},
  }),
);

function renderPicture(picture: string, index: number): JSX.Element
{
	return (
		<Grid item xs={1}>
			<Image src={picture} />
		</Grid>
	);
}

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
							<Accordion
								className="EventCard"
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
								<AccordionDetails className="EventDetails">
									<Grid
										container
										spacing={3}
									>
										<Grid
											container
											direction="row"
											justify="space-evenly"
											alignItems="flex-start"
										>
											<Grid
												item
												xs
											>
												<Typography className={classes.heading}>
													{rso.name}
												</Typography>
												<Typography className={classes.secondaryHeading}>
													{event.description}
												</Typography>
											</Grid>
											<Grid
												item
												xs
											>
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
											</Grid>
										</Grid>
										<Grid
											container
											direction="row"
											justify="space-evenly"
											alignItems="flex-start"
										>
											{event.eventPictures.map(renderPicture)}
										</Grid>
									</Grid>
							</AccordionDetails>
						</Accordion>
					);
				})
			}
		</>
	)
}

export default EventCards
