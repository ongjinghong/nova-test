import React, { useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Button,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import BuildIcon from "@mui/icons-material/Build";
import PsychologyIcon from "@mui/icons-material/Psychology";

import useInnovationStore from "../../../stores/InnovationStore";

const principles = [
  {
    name: "Segmentation",
    explanation: "Divide an object into independent parts.",
    example: "Segmenting a large project into smaller, manageable tasks.",
  },
  {
    name: "Extraction",
    explanation:
      "Extract (remove or separate) a disturbing part or property from an object.",
    example: "Removing seeds from fruit to make it easier to eat.",
  },
  {
    name: "Local Quality",
    explanation: "Change an object's structure from uniform to non-uniform.",
    example:
      "Using different materials in different parts of a product to optimize performance.",
  },
  {
    name: "Asymmetry",
    explanation:
      "Change the shape of an object from symmetrical to asymmetrical.",
    example:
      "Designing a car's side mirrors to be asymmetrical for better aerodynamics.",
  },
  {
    name: "Merging",
    explanation: "Combine identical or similar objects or operations.",
    example: "Merging multiple software tools into a single platform.",
  },
  {
    name: "Universality",
    explanation: "Make an object perform multiple functions.",
    example: "A smartphone that combines a phone, camera, and computer.",
  },
  {
    name: "Nested Doll",
    explanation: "Place one object inside another.",
    example: "Stackable storage containers.",
  },
  {
    name: "Anti-Weight",
    explanation: "Compensate for the weight of an object.",
    example: "Using helium balloons to lift a heavy load.",
  },
  {
    name: "Preliminary Anti-action",
    explanation:
      "Perform an action in advance to counteract potential negative effects.",
    example: "Applying a protective coating to prevent rust.",
  },
  {
    name: "Equipotentiality",
    explanation: "Eliminate differences in potential energy.",
    example: "Using a level to ensure a surface is flat.",
  },
  {
    name: "Prior Action",
    explanation: "Perform an action in advance to prepare for another action.",
    example: "Preheating an oven before baking.",
  },
  {
    name: "Cushion in Advance",
    explanation:
      "Prepare emergency means beforehand to compensate for the relatively low reliability of an object.",
    example: "Installing airbags in cars for safety.",
  },
  {
    name: "Partial or Excessive Action",
    explanation:
      "If 100% of an objective is hard to achieve, use 'slightly less' or 'slightly more' of the same method.",
    example: "Overfilling a container to ensure it is completely full.",
  },
  {
    name: "Another Dimension",
    explanation: "Move an object in two- or three-dimensional space.",
    example: "Using vertical storage to save floor space.",
  },
  {
    name: "Dynamics",
    explanation: "Allow an object to change to achieve optimal performance.",
    example: "Adjustable office chairs.",
  },
  {
    name: "Partial or Excessive Action",
    explanation:
      "If 100% of an objective is hard to achieve, use 'slightly less' or 'slightly more' of the same method.",
    example: "Overfilling a container to ensure it is completely full.",
  },
  {
    name: "Transition into a New Dimension",
    explanation: "Use a different dimension to solve a problem.",
    example: "Using 3D printing to create complex shapes.",
  },
  {
    name: "Mechanical Vibration",
    explanation: "Use vibrations to achieve a desired effect.",
    example: "Using ultrasonic cleaners to clean delicate items.",
  },
  {
    name: "Periodic Action",
    explanation: "Replace a continuous action with a periodic one.",
    example: "Using intermittent windshield wipers.",
  },
  {
    name: "Continuity of Useful Action",
    explanation: "Perform an action continuously without interruption.",
    example: "Using conveyor belts in manufacturing.",
  },
  {
    name: "Skipping",
    explanation: "Conduct a process or certain stages of it at high speed.",
    example: "Skipping unnecessary steps in a process to save time.",
  },
  {
    name: "Blessing in Disguise",
    explanation: "Use harmful factors to achieve a positive effect.",
    example: "Using waste heat to generate electricity.",
  },
  {
    name: "Feedback",
    explanation: "Introduce feedback to improve a process.",
    example: "Using customer feedback to improve a product.",
  },
  {
    name: "Intermediary",
    explanation:
      "Use an intermediary object to transfer or carry out an action.",
    example: "Using a pulley system to lift heavy objects.",
  },
  {
    name: "Self-service",
    explanation:
      "Make an object serve itself by performing auxiliary functions.",
    example: "Self-cleaning ovens.",
  },
  {
    name: "Copying",
    explanation: "Use a simple and inexpensive copy instead of an original.",
    example: "Using a prototype to test a design.",
  },
  {
    name: "Cheap Short-Living Objects",
    explanation: "Replace an expensive object with a cheap one.",
    example: "Using disposable razors.",
  },
  {
    name: "Replace Mechanical Means",
    explanation: "Replace mechanical means with other methods.",
    example: "Using electronic sensors instead of mechanical switches.",
  },
  {
    name: "Pneumatics and Hydraulics",
    explanation: "Use pneumatic or hydraulic systems.",
    example: "Using hydraulic lifts.",
  },
  {
    name: "Flexible Shells and Thin Films",
    explanation:
      "Use flexible shells and thin films instead of solid structures.",
    example: "Using plastic wrap to preserve food.",
  },
  {
    name: "Porous Materials",
    explanation: "Use porous materials.",
    example: "Using sponges for cleaning.",
  },
  {
    name: "Color Changes",
    explanation: "Change the color of an object.",
    example: "Using color-coded wires for easy identification.",
  },
  {
    name: "Homogeneity",
    explanation: "Make objects interact with the same material.",
    example: "Using metal fasteners for metal parts.",
  },
  {
    name: "Discarding and Recovering",
    explanation: "Discard or recover parts of an object.",
    example: "Recycling materials from old products.",
  },
  {
    name: "Parameter Changes",
    explanation: "Change the parameters of an object.",
    example: "Adjusting the temperature of a process.",
  },
  {
    name: "Phase Transitions",
    explanation: "Use phase transitions.",
    example: "Using ice to cool drinks.",
  },
  {
    name: "Thermal Expansion",
    explanation: "Use thermal expansion to achieve a desired effect.",
    example: "Using bimetallic strips in thermostats.",
  },
  {
    name: "Strong Oxidants",
    explanation: "Use strong oxidants.",
    example: "Using bleach for cleaning.",
  },
  {
    name: "Inert Atmosphere",
    explanation: "Use an inert atmosphere.",
    example: "Using nitrogen to preserve food.",
  },
  {
    name: "Composite Materials",
    explanation: "Use composite materials.",
    example: "Using fiberglass for strength and flexibility.",
  },
];

const popularPrinciples = [
  "Segmentation",
  "Extraction",
  "Local Quality",
  "Asymmetry",
  "Merging",
  "Universality",
  "Nested Doll",
  "Anti-Weight",
  "Preliminary Anti-action",
  "Equipotentiality",
];

const TRIZ = () => {
  const { setCurrentPage } = useInnovationStore();
  const topRef = useRef(null);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <>
      <div ref={topRef}></div>
      <Box sx={{ marginLeft: 2, marginTop: 2 }}>
        <Button variant="text" onClick={() => setCurrentPage("home")}>
          Back to Tools
        </Button>
      </Box>
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography variant="h3" align="center" gutterBottom>
          🚀 Innovate Smarter with TRIZ!
        </Typography>
        <Typography variant="subtitle1" align="center">
          TRIZ (Theory of Inventive Problem Solving) is a powerful innovation
          methodology created by Genrich Altshuller. It helps you systematically
          solve problems and develop creative solutions by learning from past
          innovations.
        </Typography>

        <Card sx={{ my: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              💡 What exactly is TRIZ?
            </Typography>
            <Typography variant="body1">
              TRIZ is based on analyzing patterns of invention in patents. It
              distills innovation into core principles and methods that can be
              applied across various domains. TRIZ guides you to find creative
              solutions by overcoming contradictions instead of compromising!
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h4" gutterBottom>
          🔧 Core Components of TRIZ
        </Typography>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">1. Contradictions</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Innovation arises from solving contradictions between two
              competing requirements. Instead of compromising, TRIZ provides
              techniques to overcome these contradictions elegantly. The
              Contradiction Matrix, often used in TRIZ, helps innovators match
              specific contradictions to effective inventive principles.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">2. 40 Inventive Principles</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography gutterBottom>
              TRIZ identifies 40 inventive principles commonly found in
              breakthrough solutions. Below is the complete list, highlighting
              the top 10 popular ones:
            </Typography>
            <List>
              {principles.map((principle, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ListItemIcon>
                    <LightbulbIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${index + 1}. ${principle.name}`}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                        >
                          {principle.explanation}
                        </Typography>
                        <br />
                        <Typography
                          component="span"
                          variant="body2"
                          color="textSecondary"
                        >
                          Example: {principle.example}
                        </Typography>
                      </>
                    }
                  />
                  {popularPrinciples.includes(principle.name) && (
                    <Chip label="Popular" color="primary" size="small" />
                  )}
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">3. Ideal Final Result (IFR)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              IFR describes the perfect scenario where the problem is solved
              without complexity or cost. It helps innovators focus on desired
              outcomes rather than limitations.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Card sx={{ mt: 4, backgroundColor: "#f9fbe7", color: "black" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              🧠 Why Learn TRIZ?
            </Typography>
            <Divider />
            <List>
              <ListItem>
                <ListItemIcon>
                  <PsychologyIcon sx={{ color: "black" }} />
                </ListItemIcon>
                <ListItemText primary="Enhances creativity and problem-solving skills." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <BuildIcon sx={{ color: "black" }} />
                </ListItemIcon>
                <ListItemText primary="Offers structured approaches for innovation." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LightbulbIcon sx={{ color: "black" }} />
                </ListItemIcon>
                <ListItemText primary="Leads to innovative solutions by overcoming contradictions." />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Card sx={{ mt: 4, backgroundColor: "#e8f5e9" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom color="black">
              📚 Learn More About TRIZ
            </Typography>
            <List>
              <ListItem>
                <Link href="https://en.wikipedia.org/wiki/TRIZ" target="_blank">
                  Wikipedia: TRIZ Overview
                </Link>
              </ListItem>
              <ListItem>
                <Link href="https://www.triz40.com" target="_blank">
                  TRIZ40: Solving technical problems with TRIZ methodology
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.mindtools.com/pages/article/newCT_92.htm"
                  target="_blank"
                >
                  TRIZ at MindTools
                </Link>
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Typography variant="body2" align="center" sx={{ mt: 4 }}>
          🎉 Ready to unleash your creativity and innovation potential? Dive
          deeper into TRIZ and transform your problem-solving approach today!
        </Typography>
      </Container>
    </>
  );
};

export default TRIZ;
