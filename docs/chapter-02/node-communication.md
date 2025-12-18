---
sidebar_label: 2.2 Node Communication
sidebar_position: 3
---

# 2.2 Node Communication

## DDS-Based Communication Infrastructure

ROS 2's communication system is built on the Data Distribution Service (DDS) standard, providing robust, real-time communication capabilities essential for embodied intelligence systems.

## Message Definition and Types

### ROS 2 Message Types
Messages define the structure of data exchanged between nodes:

```ros
# Example message definition (Point.msg)
float64 x
float64 y
float64 z
```

### Custom Message Creation
Creating application-specific message types:

```bash
# Create package with messages
ros2 pkg create --build-type ament_cmake my_robot_msgs
cd my_robot_msgs

# Create message files
mkdir msg
echo "float64 joint_angle" > msg/JointState.msg
echo "JointState[] joints" > msg/RobotState.msg

# Update package.xml and CMakeLists.txt
```

### Message Compilation
Building and using custom messages:

```xml
<!-- package.xml -->
<build_depend>rosidl_default_generators</build_depend>
<exec_depend>rosidl_default_runtime</exec_depend>
<member_of_group>rosidl_interface_packages</member_of_group>
```

## Publisher-Subscriber Pattern

### Basic Publisher Implementation
```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import JointState

class JointStatePublisher(Node):
    def __init__(self):
        super().__init__('joint_state_publisher')

        # Create publisher with QoS settings
        qos_profile = QoSProfile(
            reliability=QoSReliabilityPolicy.BEST_EFFORT,
            history=QoSHistoryPolicy.KEEP_LAST,
            depth=10
        )

        self.publisher = self.create_publisher(
            JointState,
            'joint_states',
            qos_profile
        )

        # Publish at 100 Hz
        self.timer = self.create_timer(0.01, self.publish_joint_states)

    def publish_joint_states(self):
        msg = JointState()
        msg.header.stamp = self.get_clock().now().to_msg()
        msg.name = ['joint1', 'joint2', 'joint3']
        msg.position = [0.1, 0.2, 0.3]  # Example positions

        self.publisher.publish(msg)
        self.get_logger().info('Published joint states')
```

### Subscriber Implementation
```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import JointState

class JointStateSubscriber(Node):
    def __init__(self):
        super().__init__('joint_state_subscriber')

        qos_profile = QoSProfile(
            reliability=QoSReliabilityPolicy.BEST_EFFORT,
            history=QoSHistoryPolicy.KEEP_LAST,
            depth=10
        )

        self.subscription = self.create_subscription(
            JointState,
            'joint_states',
            self.joint_state_callback,
            qos_profile
        )

    def joint_state_callback(self, msg):
        self.get_logger().info(
            f'Received joint positions: {msg.position}'
        )
```

## Service-Based Communication

### Service Definition
```ros
# Example service definition (AddTwoInts.srv)
int64 a
int64 b
---
int64 sum
```

### Service Server Implementation
```python
import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts

class AddTwoIntsServer(Node):
    def __init__(self):
        super().__init__('add_two_ints_server')
        self.srv = self.create_service(
            AddTwoInts,
            'add_two_ints',
            self.add_two_ints_callback
        )

    def add_two_ints_callback(self, request, response):
        response.sum = request.a + request.b
        self.get_logger().info(
            f'Incoming request: {request.a} + {request.b} = {response.sum}'
        )
        return response
```

### Service Client Implementation
```python
import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts

class AddTwoIntsClient(Node):
    def __init__(self):
        super().__init__('add_two_ints_client')
        self.cli = self.create_client(AddTwoInts, 'add_two_ints')
        while not self.cli.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('Service not available, waiting...')
        self.req = AddTwoInts.Request()

    def send_request(self, a, b):
        self.req.a = a
        self.req.b = b
        self.future = self.cli.call_async(self.req)
        rclpy.spin_until_future_complete(self, self.future)
        return self.future.result()
```

## Action-Based Communication

### Action Definition
```ros
# Example action definition (Fibonacci.action)
int32 order
---
int32[] sequence
---
int32[] partial_sequence
```

### Action Server Implementation
```python
import rclpy
from rclpy.node import Node
from rclpy.action import ActionServer
from example_interfaces.action import Fibonacci

class FibonacciActionServer(Node):
    def __init__(self):
        super().__init__('fibonacci_action_server')
        self._action_server = ActionServer(
            self,
            Fibonacci,
            'fibonacci',
            self.execute_callback
        )

    def execute_callback(self, goal_handle):
        self.get_logger().info('Executing goal...')

        feedback_msg = Fibonacci.Feedback()
        result = Fibonacci.Result()

        # Generate Fibonacci sequence
        sequence = [0, 1]
        for i in range(1, goal_handle.request.order):
            sequence.append(sequence[i] + sequence[i-1])

            # Provide feedback
            feedback_msg.partial_sequence = sequence
            goal_handle.publish_feedback(feedback_msg)

        result.sequence = sequence
        goal_handle.succeed()
        return result
```

### Action Client Implementation
```python
import rclpy
from rclpy.node import Node
from rclpy.action import ActionClient
from example_interfaces.action import Fibonacci

class FibonacciActionClient(Node):
    def __init__(self):
        super().__init__('fibonacci_action_client')
        self._action_client = ActionClient(self, Fibonacci, 'fibonacci')

    def send_goal(self, order):
        goal_msg = Fibonacci.Goal()
        goal_msg.order = order

        self._action_client.wait_for_server()

        self._send_goal_future = self._action_client.send_goal_async(
            goal_msg,
            feedback_callback=self.feedback_callback
        )

        self._send_goal_future.add_done_callback(self.goal_response_callback)

    def goal_response_callback(self, future):
        goal_handle = future.result()
        if not goal_handle.accepted:
            self.get_logger().info('Goal rejected')
            return

        self.get_logger().info('Goal accepted')
        self._get_result_future = goal_handle.get_result_async()
        self._get_result_future.add_done_callback(self.get_result_callback)

    def feedback_callback(self, feedback_msg):
        self.get_logger().info(
            f'Received feedback: {feedback_msg.feedback.partial_sequence}'
        )

    def get_result_callback(self, future):
        result = future.result().result
        self.get_logger().info(f'Result: {result.sequence}')
```

## Quality of Service (QoS) Configuration

### QoS Profile Selection
ROS 2 provides predefined QoS profiles:

```python
from rclpy.qos import QoSPresetProfiles

# Sensor data - high frequency, low latency
sensor_qos = QoSPresetProfiles.SENSOR_DATA.value

# System state - reliable, durable
state_qos = QoSPresetProfiles.PARAMETER_EVENTS.value

# Control commands - reliable, transient
control_qos = QoSPresetProfiles.SERVICES_DEFAULT.value
```

### Custom QoS Configuration
Fine-tuning QoS parameters for specific requirements:

```python
from rclpy.qos import QoSProfile, QoSReliabilityPolicy, QoSHistoryPolicy

custom_qos = QoSProfile(
    reliability=QoSReliabilityPolicy.RELIABLE,
    history=QoSHistoryPolicy.KEEP_LAST,
    depth=100,
    lifespan=Duration(seconds=10),
    deadline=Duration(seconds=0.1),
    liveliness_lease_duration=Duration(seconds=1)
)
```

## Communication Patterns for Embodied Intelligence

### Sensor Data Distribution
High-frequency sensor data requires optimized communication:

- **QoS Settings**: Best effort reliability, keep last history
- **Message Frequency**: 100-1000 Hz depending on sensor type
- **Data Volume**: Efficient binary serialization
- **Multicasting**: Multiple consumers for same sensor data

### Control Command Distribution
Critical control commands need guaranteed delivery:

- **QoS Settings**: Reliable delivery, transient local durability
- **Message Frequency**: 100-1000 Hz for smooth control
- **Acknowledgment**: Synchronous confirmation of receipt
- **Failover**: Automatic rerouting on node failure

### State Synchronization
System state sharing across distributed components:

- **QoS Settings**: Reliable, transient local, keep last
- **Message Frequency**: 10-50 Hz for state updates
- **Consistency**: Atomic state updates across subscribers
- **Versioning**: State schema evolution support

## Performance Optimization

### Message Serialization
Efficient data encoding for network transmission:

- **CDR (Common Data Representation)**: DDS standard serialization
- **Compression**: Optional compression for large messages
- **Zero-copy**: Shared memory for intra-process communication
- **Type safety**: Compile-time message validation

### Network Configuration
Optimizing network communication for robotics:

```bash
# Configure DDS network settings
export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
export CYCLONEDDS_URI='<CycloneDDS><Domain><General><NetworkInterfaceAddress>eth0</NetworkInterfaceAddress></General></Domain></CycloneDDS>'
```

### Monitoring and Debugging
Communication system observability:

```bash
# List active topics
ros2 topic list

# Monitor topic bandwidth
ros2 topic bw /joint_states

# Inspect message content
ros2 topic echo /joint_states

# Check QoS settings
ros2 topic info /joint_states
```

## Conclusion

ROS 2's communication system provides the foundation for reliable, real-time interaction between components in embodied intelligence systems. Understanding these communication patterns is essential for building robust, scalable robotic applications.

The next section explores practical ROS 2 development workflows that bring these communication capabilities to life in real robotic systems.
