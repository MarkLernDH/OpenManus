import asyncio
import time

from app.agent.business_intelligence import BusinessIntelligenceAgent
from app.config import config
from app.flow.flow_factory import FlowFactory, FlowType
from app.logger import logger


async def run_focused_flow():
    """Run the focused business intelligence flow."""
    agents = {
        "business_intelligence": BusinessIntelligenceAgent(),
    }
    
    try:
        prompt = input("Enter your business intelligence task: ")

        if prompt.strip().isspace() or not prompt:
            logger.warning("Empty prompt provided.")
            return

        flow = FlowFactory.create_flow(
            flow_type=FlowType.PLANNING,
            agents=agents,
        )
        logger.warning("Processing your business intelligence request...")

        try:
            start_time = time.time()
            result = await asyncio.wait_for(
                flow.execute(prompt),
                timeout=1800,  # 30 minute timeout for business intelligence tasks
            )
            elapsed_time = time.time() - start_time
            logger.info(f"Business intelligence task processed in {elapsed_time:.2f} seconds")
            logger.info(result)
        except asyncio.TimeoutError:
            logger.error("Business intelligence task timed out after 30 minutes")
            logger.info(
                "Operation terminated due to timeout. Please try a simpler request."
            )

    except KeyboardInterrupt:
        logger.info("Operation cancelled by user.")
    except Exception as e:
        logger.error(f"Error: {str(e)}")


if __name__ == "__main__":
    asyncio.run(run_focused_flow())