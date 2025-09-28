import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectAllAgents, selectActiveAgents } from "shared/infra/store/selectors/client";
import Frame from "../../components/frame";
import Title from "../../components/title";
import TextLabel from "../../components/textLabel";
import TextButton from "../../components/textButton";
import { COLORS } from "shared/domain/Gui";
import { AgentMetadata } from "shared/domain/Agent";

interface AgentCardProps {
	agent: AgentMetadata;
	onActivate: () => void;
	onDeactivate: () => void;
}

function AgentCard({ agent, onActivate, onDeactivate }: AgentCardProps) {
	const statusColor = agent.isEnabled ? COLORS.Buttons.On : COLORS.Buttons.Off;
	const statusText = agent.isEnabled ? "Active" : "Inactive";
	
	return (
		<Frame
			size={new UDim2(1, -10, 0, 120)}
			position={new UDim2(0, 5, 0, 0)}
			backgroundTransparency={0.1}
			backgroundColor3={COLORS.SecondaryBackground}
			uiCornerSize={new UDim(0, 8)}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Vertical}
				Padding={new UDim(0, 8)}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			
			<uipadding
				PaddingTop={new UDim(0, 8)}
				PaddingBottom={new UDim(0, 8)}
				PaddingLeft={new UDim(0, 12)}
				PaddingRight={new UDim(0, 12)}
			/>

			<Frame size={new UDim2(1, 0, 0, 24)} backgroundTransparency={1}>
				<TextLabel
					text={agent.name}
					textSize={18}
					textColor3={COLORS.White}
					size={new UDim2(0.7, 0, 1, 0)}
					position={new UDim2(0, 0, 0, 0)}
					anchorPoint={new Vector2(0, 0)}
					textXAlignment={Enum.TextXAlignment.Left}
				/>
				
				<TextLabel
					text={statusText}
					textSize={14}
					textColor3={statusColor}
					size={new UDim2(0.3, 0, 1, 0)}
					position={new UDim2(0.7, 0, 0, 0)}
					anchorPoint={new Vector2(0, 0)}
					textXAlignment={Enum.TextXAlignment.Right}
				/>
			</Frame>

			<TextLabel
				text={agent.description}
				textSize={12}
				textColor3={COLORS.White}
				size={new UDim2(1, 0, 0, 18)}
				textXAlignment={Enum.TextXAlignment.Left}
				textWrap={true}
			/>

			<TextLabel
				text={`v${agent.version} by ${agent.author}`}
				textSize={10}
				textColor3={Color3.fromRGB(200, 200, 200)}
				size={new UDim2(1, 0, 0, 16)}
				textXAlignment={Enum.TextXAlignment.Left}
			/>

			<Frame size={new UDim2(1, 0, 0, 32)} backgroundTransparency={1}>
				<TextButton
					text={agent.isEnabled ? "Deactivate" : "Activate"}
					size={new UDim2(0, 100, 1, 0)}
					textSize={12}
					position={new UDim2(1, -100, 0, 0)}
					anchorPoint={new Vector2(1, 0)}
					onClick={agent.isEnabled ? onDeactivate : onActivate}
					backgroundColor3={agent.isEnabled ? COLORS.Buttons.Off : COLORS.Buttons.On}
				/>
			</Frame>
		</Frame>
	);
}

export default function AgentsApp() {
	const allAgents = useSelector(selectAllAgents);
	const activeAgents = useSelector(selectActiveAgents);

	const handleActivateAgent = (agentId: string) => {
		print(`[AgentsApp] Activating agent: ${agentId}`);
		// In a full implementation, this would call the client agent manager
	};

	const handleDeactivateAgent = (agentId: string) => {
		print(`[AgentsApp] Deactivating agent: ${agentId}`);
		// In a full implementation, this would call the client agent manager
	};

	return (
		<Frame
			anchorPoint={new Vector2(0.5, 0.5)}
			position={new UDim2(0.5, 0, 0.5, 0)}
			size={new UDim2(0, 600, 0, 500)}
			backgroundColor3={COLORS.PrimaryBackground}
		>
			<Title text="Agent Management" />

			{/* Stats Header */}
			<Frame
				size={new UDim2(1, -20, 0, 40)}
				position={new UDim2(0, 10, 0, 60)}
				backgroundTransparency={0.2}
				backgroundColor3={COLORS.SecondaryBackground}
				uiCornerSize={new UDim(0, 6)}
			>
				<TextLabel
					text={`Total Agents: ${allAgents.size()} | Active: ${activeAgents.size()}`}
					textSize={14}
					textColor3={COLORS.White}
					size={new UDim2(1, -20, 1, 0)}
					position={new UDim2(0, 10, 0, 0)}
					textXAlignment={Enum.TextXAlignment.Left}
				/>
			</Frame>

			{/* Agents List */}
			<scrollingframe
				Size={new UDim2(1, -20, 1, -120)}
				Position={new UDim2(0, 10, 0, 110)}
				BackgroundTransparency={0.2}
				BackgroundColor3={COLORS.SecondaryBackground}
				BorderSizePixel={0}
				ScrollBarThickness={8}
				CanvasSize={new UDim2(0, 0, 0, allAgents.size() * 130)}
			>
				<uicorner CornerRadius={new UDim(0, 6)} />
				
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					Padding={new UDim(0, 10)}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>

				<uipadding
					PaddingTop={new UDim(0, 10)}
					PaddingBottom={new UDim(0, 10)}
					PaddingLeft={new UDim(0, 10)}
					PaddingRight={new UDim(0, 10)}
				/>

				{allAgents.map((agent, index) => (
					<AgentCard
						key={agent.id}
						agent={agent}
						onActivate={() => handleActivateAgent(agent.id)}
						onDeactivate={() => handleDeactivateAgent(agent.id)}
					/>
				))}

				{allAgents.size() === 0 && (
					<TextLabel
						text="No agents available"
						textSize={16}
						textColor3={COLORS.White}
						size={new UDim2(1, 0, 1, 0)}
						textXAlignment={Enum.TextXAlignment.Center}
						textYAlignment={Enum.TextYAlignment.Center}
					/>
				)}
			</scrollingframe>
		</Frame>
	);
}