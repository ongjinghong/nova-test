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

const scamperMethods = [
  {
    name: "Substitute",
    description:
      "Replace a component or element of a product or process with an alternative to improve it.",
    example:
      "IKEA substituted slow-growing wood with fast-growing trees and recycled materials to enhance sustainability.",
  },
  {
    name: "Combine",
    description:
      "Merge two or more elements to create a new product or process.",
    example:
      "Mobile phones combined telephony and radio technologies, evolving into smartphones that integrate cameras and other features.",
  },
  {
    name: "Adapt",
    description:
      "Adjust or tweak an existing product or process to serve a different purpose or meet new demands.",
    example:
      "Henry Ford adapted the moving assembly line from slaughterhouses to revolutionize car manufacturing.",
  },
  {
    name: "Modify",
    description:
      "Alter the appearance, form, or function of a product or process to improve it.",
    example:
      "Smartphone manufacturers have modified camera designs, adding multiple lenses to enhance photography.",
  },
  {
    name: "Put to Another Use",
    description:
      "Repurpose an existing product or process for a different application.",
    example:
      "Adidas uses recycled ocean waste to produce shoes, giving new life to discarded materials.",
  },
  {
    name: "Eliminate",
    description:
      "Remove unnecessary components to simplify a product or process.",
    example:
      "Eliminating DVD drives from laptops allowed for thinner designs and encouraged cloud storage adoption.",
  },
  {
    name: "Reverse/Rearrange",
    description:
      "Rearrange or invert the order of components in a product or process.",
    example:
      "Reversing the process of using plastic bags by returning to paper bags addresses environmental concerns.",
  },
];

const SCAMPER = () => {
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
          🚀 Unleash Creativity with the SCAMPER Technique!
        </Typography>
        <Typography variant="subtitle1" align="center" paragraph>
          SCAMPER is a powerful brainstorming method that encourages innovative
          thinking by exploring seven different approaches: Substitute, Combine,
          Adapt, Modify, Put to Another Use, Eliminate, and Reverse.
        </Typography>

        <Card sx={{ my: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              💡 What is SCAMPER?
            </Typography>
            <Typography variant="body1">
              The SCAMPER technique is a creative problem-solving method that
              helps individuals and teams generate innovative ideas by
              questioning and transforming existing products, services, or
              processes. Each letter in SCAMPER represents a different approach
              to thinking about improvements and innovations.
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h4" gutterBottom>
          🔧 The Seven SCAMPER Methods with Real-World Examples
        </Typography>

        {scamperMethods.map((method, index) => (
          <Accordion key={index} defaultExpanded={index === 0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{method.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography gutterBottom>{method.description}</Typography>
              <Typography variant="subtitle1" gutterBottom>
                Example:
              </Typography>
              <Typography gutterBottom>{method.example} </Typography>
            </AccordionDetails>
          </Accordion>
        ))}

        <Card sx={{ mt: 4, backgroundColor: "#e8f5e9" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: "black" }}>
              📚 Learn More About SCAMPER
            </Typography>
            <List>
              <ListItem>
                <Link
                  href="https://en.wikipedia.org/wiki/SCAMPER"
                  target="_blank"
                  rel="noopener"
                >
                  Wikipedia: SCAMPER Overview
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.interaction-design.org/literature/article/learn-how-to-use-the-best-ideation-methods-scamper?srsltid=AfmBOopP0-4Wn3sJtw0nzAnHfL8C8vAtt137mN1aD_1K0i4iiB1rhSBk"
                  target="_blank"
                  rel="noopener"
                >
                  Scamper: How to Use the Best Ideation Methods
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.designorate.com/scamper-technique-examples-and-applications/"
                  target="_blank"
                  rel="noopener"
                >
                  Source: SCAMPER Technique Examples and Applications
                </Link>
              </ListItem>
            </List>
          </CardContent>
        </Card>

        <Typography variant="body2" align="center" sx={{ mt: 4 }}>
          🎉 Ready to unlock your creative potential? Apply the SCAMPER
          technique to your challenges and watch innovative solutions emerge!
        </Typography>
      </Container>
    </>
  );
};

export default SCAMPER;
