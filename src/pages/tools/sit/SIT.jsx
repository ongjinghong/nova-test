import React, { useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  Link,
  Button,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import useInnovationStore from "../../../stores/InnovationStore";

const sitTools = [
  {
    name: "Subtraction",
    description:
      "Remove an essential component from a product or process to uncover new opportunities or configurations.",
    example:
      "Eliminating the traditional keyboard from smartphones led to the development of touch-screen interfaces.",
  },
  {
    name: "Multiplication",
    description:
      "Add a component similar to an existing one but altered in some way.",
    example:
      "Adding multiple blades to a razor enhances the shaving experience.",
  },
  {
    name: "Division",
    description:
      "Divide a product or process into parts and rearrange them to form a new structure.",
    example:
      "Dividing a department store into specialized boutiques can enhance customer experience.",
  },
  {
    name: "Task Unification",
    description: "Assign a new task to an existing resource.",
    example:
      "Using a car's rearview mirror to display navigation information combines two functions into one component.",
  },
  {
    name: "Attribute Dependency",
    description:
      "Create or dissolve dependencies between variables of a product or process.",
    example:
      "Transition lenses that darken in response to sunlight intensity demonstrate attribute dependency.",
  },
];

const SIT = () => {
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
          🚀 Innovate with Systematic Inventive Thinking (SIT)!
        </Typography>
        <Typography variant="subtitle1" align="center">
          Systematic Inventive Thinking (SIT) is a structured methodology for
          creativity, innovation, and problem-solving, developed in Israel in
          the mid-1990s. Rooted in the principles of TRIZ (Theory of Inventive
          Problem Solving), SIT operates on the premise that inventive solutions
          share common patterns. By identifying and applying these patterns,
          individuals and organizations can systematically generate innovative
          ideas and solutions.
        </Typography>

        <Card sx={{ my: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              💡 What is SIT?
            </Typography>
            <Typography variant="body1">
              SIT is a practical approach to creativity, innovation, and
              problem-solving, which has become a well-known methodology for
              innovation. At the heart of SIT's method is one core idea adopted
              from Genrich Altshuller's TRIZ: that inventive solutions share
              common patterns. Focusing not on what makes inventive solutions
              different, but on what they share in common, is core to SIT's
              approach.
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h4" gutterBottom>
          🔧 Five Core Thinking Tools of SIT
        </Typography>

        {sitTools.map((tool, index) => (
          <Accordion key={index} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{tool.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{tool.description}</Typography>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                Example: {tool.example}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}

        <Card sx={{ mt: 4, backgroundColor: "#e8f5e9" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: "black" }}>
              📚 Learn More About SIT
            </Typography>
            <List>
              <ListItem>
                <Link
                  href="https://en.wikipedia.org/wiki/Systematic_inventive_thinking"
                  target="_blank"
                  rel="noopener"
                >
                  Wikipedia: Systematic Inventive Thinking Overview
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.sitsite.com/"
                  target="_blank"
                  rel="noopener"
                >
                  Official SIT Website
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://drewboyd.com/the-sit-method/"
                  target="_blank"
                  rel="noopener"
                >
                  The SIT Method by Drew Boyd
                </Link>
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Typography variant="body2" align="center" sx={{ mt: 4 }}>
          🎉 Ready to unleash your creativity and innovation potential? Dive
          deeper into SIT and transform your problem-solving approach today!
        </Typography>
      </Container>
    </>
  );
};

export default SIT;
