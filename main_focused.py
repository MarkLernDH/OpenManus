import argparse
import asyncio

from app.agent.business_intelligence import BusinessIntelligenceAgent
from app.logger import logger


async def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="Run Business Intelligence agent with a prompt")
    parser.add_argument(
        "--prompt", type=str, required=False, help="Input prompt for the agent"
    )
    args = parser.parse_args()

    # Create and initialize Business Intelligence agent
    agent = await BusinessIntelligenceAgent.create()
    try:
        # Use command line prompt if provided, otherwise ask for input
        prompt = args.prompt if args.prompt else input("Enter your business intelligence task: ")
        if not prompt.strip():
            logger.warning("Empty prompt provided.")
            return

        logger.warning("Processing your business intelligence request...")
        await agent.run(prompt)
        logger.info("Business intelligence task completed.")
    except KeyboardInterrupt:
        logger.warning("Operation interrupted.")
    finally:
        # Ensure agent resources are cleaned up before exiting
        await agent.cleanup()


if __name__ == "__main__":
    asyncio.run(main())